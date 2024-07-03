import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {forkJoin, Observable, of, Subject, tap} from "rxjs";
import {Meet, ResAllGoogleEvent, ResAllMeet, ResAllTask, ResOneMeet, ResOneTask, Task} from "../models/calendarModel";
import {environment} from "../../environments/environment";
import {DateEvent, Day} from "../models/dateModel";
import {Relation} from "../models/relationModel";
import {MemberService} from "./member.service";
import {ErrorService} from "./error.service";
import {DateService} from "./date.service";
import { isBefore, isSameDay } from 'date-fns';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  api:string = environment.api;
  private calendarUpdated = new Subject<any>();
  private calendarDateChange = new Subject<boolean>();
  private updateEventEmit = new Subject<[number, any]>();
  private dateClickSource = new Subject<Day>();
  dateClick$ = this.dateClickSource.asObservable();

  constructor(
    private _client : HttpClient,
    private _memberService : MemberService,
    private _errorService : ErrorService,
    private _dateService : DateService
  ) { }

  getCalendarUpdateEmitter() {
    return this.calendarUpdated.asObservable();
  }

  getCallUpdateEventEmitter() : Observable<[number, any]> {
    return this.updateEventEmit.asObservable();
  }

  callUpdateEventEmit(id : number, dateEnding : any) {
    this.updateEventEmit.next([id, dateEnding]);
  }

  getCalendarDateChangeEmitter() {
    return this.calendarDateChange.asObservable();
  }

  emitCalendarDateChange() {
    this.calendarDateChange.next(!this.calendarDateChange);
  }

  createTask(title:string, description:string, dateBegin:string, recurrence:string, participant:Relation[]) :Observable<any> {
    const isRecurring = recurrence !== "";
    const MemberId = this._getUserId();
    const MemberIdArray = this._fillMemberIdArray(MemberId, participant);

    return this._client.post<any>(this.api + "tasks", {
      title,
      description,
      dateBegin,
      isRecurring,
      recurrence,
      MemberIdArray
    }).pipe(tap(updatedCalendar => {
      this.calendarUpdated.next(updatedCalendar);
    }))
  }

  createMeet(title:string, description:string, dateBegin:string, dateEnding:string, linkOrLocalisation:string,participant:Relation[]) :Observable<any> {
    const isRecurring = false;
    const MemberId = this._getUserId();
    const MemberIdArray = this._fillMemberIdArray(MemberId, participant);

    return this._client.post<any>(this.api + "meets", {
      title,
      description,
      dateBegin,
      dateEnding,
      isRecurring,
      recurrence : "",
      MemberIdArray,
      linkOrLocalisation
    }).pipe(tap(updatedCalendar => {
      this.calendarUpdated.next(updatedCalendar);
    }))
  }

  getAllPlanned() : Observable<[ResAllTask, ResAllMeet]> {
    return forkJoin([this._getAllTasks(), this._getAllMeets()]);
  }

  getOneTask(id : number) : Observable<ResOneTask> {
    return this._client.get<ResOneTask>(this.api + "tasks/" + id);
  }

  getOneMeet(id : number) : Observable<ResOneMeet> {
    return this._client.get<ResOneMeet>(this.api + "meets/" + id);
  }

  updateTask(title:string, description:string, dateBegin:string, recurrence:string, participant:Relation[], id : number) :Observable<any> {
    const isRecurring = recurrence !== "";
    const MemberId = this._getUserId();
    console.log(participant);
    const MemberIdArray = this._fillMemberIdArray(MemberId, participant);
    console.log(MemberIdArray);

    return this._client.put<any>(this.api + "tasks/" + id, {
      title,
      description,
      dateBegin,
      isRecurring,
      recurrence,
      MemberIdArray
    }).pipe(tap(updatedCalendar => {
      this.calendarUpdated.next(updatedCalendar);
    }))
  }

  updateMeet(title:string, description:string, dateBegin:string, dateEnding:string, participant:Relation[], id:number, linkOrLocalisation:string)  :Observable<any> {
    const isRecurring = false;
    const MemberId = this._getUserId();
    const MemberIdArray = this._fillMemberIdArray(MemberId, participant);

    return this._client.put<any>(this.api + "meets/" + id , {
      title,
      description,
      dateBegin,
      dateEnding,
      isRecurring,
      recurrence : "",
      MemberIdArray,
      linkOrLocalisation
    }).pipe(tap(updatedCalendar => {
      this.calendarUpdated.next(updatedCalendar);
    }))
  }

  deleteTask(id : number) :Observable<any> {
    return this._client.delete<any>(this.api + "tasks/" + id).pipe(tap(updatedCalendar => {
      this.calendarUpdated.next(updatedCalendar);
    }))
  }

  deleteMeet(id : number) :Observable<any> {
    return this._client.delete<any>(this.api + "meets/" + id).pipe(tap(updatedCalendar => {
      this.calendarUpdated.next(updatedCalendar);
    }))
  }

  filterEventForPlanning (planned : { tasks : Task[], meets : Meet[]}) : Observable<any> {
    let planningWithEvent = this._pushTasksInPlanningWithEvent(planned.tasks);
    planningWithEvent = this._pushMeetsInPlanningWithEvent(planned.meets, planningWithEvent);
    planningWithEvent = this._sortEventForPlanning(planningWithEvent);

    return of (planningWithEvent);
  }

  filterEventForThisDay (planned : { tasks : Task[], meets : Meet[]}, day : Day) {
    let dayWithEvent : [{}] = [{}];
    dayWithEvent = this._pushTasksInDayWithEvent(planned.tasks, day, dayWithEvent);
    dayWithEvent = this._pushMeetsInDayWithEvent(planned.meets, dayWithEvent, day);
    dayWithEvent.sort((a : any, b : any) => a.dateTime - b.dateTime);

    return of(dayWithEvent);
  }

  filterEventForThisWeek (planned : { tasks : Task[], meets : Meet[]}, week : Day[]) {
    let weekWithEvent = this._createWeekWithEvent(week);
    const dateBeginWeek = new Date (weekWithEvent[0].year, weekWithEvent[0].month - 1, weekWithEvent[0].day);
    const dateEndingWeek = new Date (weekWithEvent[6].year, weekWithEvent[6].month - 1, weekWithEvent[6].day);

    let i = 0;
    for (let date = dateBeginWeek; date <= dateEndingWeek; date.setDate(date.getDate() + 1)) {
      weekWithEvent = this._fillOneDayInOneTimeline(planned, date, weekWithEvent, i);
      i++;
    }

    return of(weekWithEvent);
  }

  filterEventForThisMonth (planned : { tasks : Task[], meets : Meet[]}, month : Day[]) : Observable<any> {
    let monthWithEvent = this._createMonthWithEvent(month);
    const dateBeginMonth = new Date (monthWithEvent[0].year, monthWithEvent[0].month - 1, monthWithEvent[0].day);
    const dateEndingMonth = new Date (monthWithEvent[monthWithEvent.length-1].year,
      monthWithEvent[monthWithEvent.length-1].month - 1, monthWithEvent[monthWithEvent.length-1].day);

    let i = 0;
    for (let date = dateBeginMonth; date <= dateEndingMonth; date.setDate(date.getDate() + 1)) {
      monthWithEvent = this._fillOneDayInOneTimeline(planned, date, monthWithEvent, i);
      i++;
    }

    return of(monthWithEvent);
  }

  private _fillOneDayInOneTimeline(planned : { tasks : Task[], meets : Meet[]}, oneDay : Date, timelineWithEvent : any, indexTimeline : number) {
    const day = {
      day: oneDay.getDate(),
      month: oneDay.getMonth() + 1,
      year: oneDay.getFullYear(),
      theDay: this._dateService.makeTheDay(oneDay.getDay())
    }

    timelineWithEvent[indexTimeline].events = this._filterEventForOneDay(planned, day);

    return timelineWithEvent;
  }

  private _filterEventForOneDay (planned : { tasks : Task[], meets : Meet[]}, day : Day) {
    let dayWithEvent : [{}] = [{}];
    dayWithEvent = this._pushTasksInDayWithEvent(planned.tasks, day, dayWithEvent);
    dayWithEvent = this._pushMeetsInDayWithEvent(planned.meets, dayWithEvent, day);
    dayWithEvent.sort((a : any, b : any) => a.dateTime - b.dateTime);

    return dayWithEvent;
  }

  private _pushTasksInDayWithEvent(tasks : Task[], day : Day, dayWithEvent : any) {
    const date = new Date(day.year, day.month - 1, day.day);
    const dateTimeDown = date.getTime();
    const dateTimeUp = dateTimeDown + 86400000;

    for (let i = 0; i < tasks.length; i++) {
      let dateBegin = new Date(tasks[i].dateBegin);
      let dateBeginTime = dateBegin.getTime();

      if (!tasks[i].isRecurring && (dateTimeDown <= dateBeginTime) && (dateTimeUp >= dateBeginTime)) {
        dayWithEvent = this._pushOneTaskInDayWithEvent(dayWithEvent, tasks[i], day);
      }

      if (tasks[i].isRecurring && (isBefore(dateBegin, date) || isSameDay(dateBegin, date))) {
        dayWithEvent = this._createRecurrentTaskForDay(dayWithEvent, tasks[i], day);
      }
    }

    return dayWithEvent
  }

  private _pushOneTaskInDayWithEvent(dayWithEvent : any, task : Task, day : Day) {
    const dateBegin = new Date(task.dateBegin);
    const date = new Date(day.year, day.month, day.day, dateBegin.getHours(), dateBegin.getMinutes());
    const dateTimeEvent = date.getTime();

    dayWithEvent.push({
      id: task.id,
      title: task.title,
      description: task.description,
      dateBegin: task.dateBegin,
      isRecurring: task.isRecurring,
      recurrence: task.recurrence,
      dateTime: dateTimeEvent
    })

    return dayWithEvent;
  }

  private _createRecurrentTaskForDay(dayWithEvent : any , task : Task, day : Day){
    const date = new Date(day.year, day.month - 1, day.day);
    const dateTimeDown = date.getTime();
    const dateBegin = new Date(task.dateBegin);
    const dateBeginTime = dateBegin.getTime() - 86400000;

    if (task.recurrence === "daily") {
      dayWithEvent = this._createDailyRecurrentTaskForDay(dateTimeDown, dateBeginTime, dayWithEvent, task, day);
    }

    if (task.recurrence === "weekly") {
      dayWithEvent = this._createWeekRecurrentTaskForDay(date, dateBegin, dayWithEvent, task, dateBeginTime, day);
    }

    if (task.recurrence === "monthly") {
      dayWithEvent = this._createMonthRecurrentTaskForDay(date, dateBegin, dayWithEvent, task, dateBeginTime, day);
    }

    if (task.recurrence === "annual") {
      dayWithEvent = this._createAnnualRecurrentTaskForDay(date, dateBegin, dayWithEvent, task, dateBeginTime, day);
    }

    return dayWithEvent;
  }

  private _createDailyRecurrentTaskForDay(dateTimeDown : number, dateBeginTime : number, dayWithEvent : any, task : Task, day : Day) {
    if ((dateTimeDown >= dateBeginTime)) {
      dayWithEvent = this._pushOneTaskInDayWithEvent(dayWithEvent, task, day);
    }

    return dayWithEvent;
  }

  private _createWeekRecurrentTaskForDay(date : Date, dateBegin : Date, dayWithEvent : any, task : Task, dateBeginTime : number, day : Day) {
    const dayDifference = this._dayDifference(date, dateBegin);

    if (dayDifference % 7 === 0) {
      dayWithEvent = this._pushOneTaskInDayWithEvent(dayWithEvent, task, day);
    }

    return dayWithEvent;
  }

  private _createMonthRecurrentTaskForDay(date : Date, dateBegin : Date, dayWithEvent : any, task : Task, dateBeginTime : number, day : Day) {
    if (date.getDate() === dateBegin.getDate()) {
      dayWithEvent = this._pushOneTaskInDayWithEvent(dayWithEvent, task, day);
    }

      let targetDate = dateBegin.getDate();
      let targetMonth = date.getMonth();
      let targetYear = date.getFullYear();

      let daysInTargetMonth = new Date(targetYear, targetMonth + 1, 0).getDate();

      if (targetDate > daysInTargetMonth) {
        if (date.getDate() === daysInTargetMonth) {
          dayWithEvent = this._pushOneTaskInDayWithEvent(dayWithEvent, task, day);
        }
      }

    return dayWithEvent;
  }

  private _createAnnualRecurrentTaskForDay(date : Date, dateBegin : Date, dayWithEvent : any, task : Task, dateBeginTime : number, day : Day) {
    if (date.getDate() === dateBegin.getDate() && date.getMonth() == dateBegin.getMonth()) {
      dayWithEvent = this._pushOneTaskInDayWithEvent(dayWithEvent, task, day);
    }

    return dayWithEvent;
  }

  private _pushTasksInPlanningWithEvent(tasks : Task[]) {
    let planningWithEvent = [];
    const currentDate = new Date();
    const currentDateTime = currentDate.getTime();
    let date = new Date();
    let dateTime = 0;

    for (let i = 0; i < tasks.length; i++) {
      date = new Date(tasks[i].dateBegin);
      dateTime = date.getTime();

      if (tasks[i].isRecurring) {
        planningWithEvent = this._createRecurrentTaskForPlanning(planningWithEvent, tasks[i]);
      }

      if (dateTime > currentDateTime && !tasks[i].isRecurring) {
        planningWithEvent = this._pushOneTaskInPlanning(planningWithEvent, tasks[i], dateTime);
      }
    }

    return planningWithEvent;
  }

  private _createRecurrentTaskForPlanning(planningWithEvent : any, task: Task) {
    let today = new Date();

    if (task.recurrence === "daily") {
      this._createDailyRecurrentTaskForPlanning(planningWithEvent, task, today);
    }

    if (task.recurrence === "weekly") {
      this._createWeekRecurrentTaskForPlanning(planningWithEvent, task, today);
    }

    if (task.recurrence === "monthly") {
      this._createMonthRecurrentTaskForPlanning(planningWithEvent, task, today);
    }

    if (task.recurrence === "annual") {
      this._createAnnualRecurrentTaskForPlanning(planningWithEvent, task, today);
    }

    return planningWithEvent;
  }

  private _createDailyRecurrentTaskForPlanning(planningWithEvent : any, task : Task, today : Date) {
    for (let i = 0; i < 3 ; i++) {
      let dateBegin = new Date(task.dateBegin);

      let dateToPush = new Date(today.getFullYear(), today.getMonth(), today.getDate(),
        dateBegin.getHours(), dateBegin.getMinutes());

      dateToPush.setDate(dateToPush.getDate() + i);
      let dateTimeToPush = dateToPush.getTime();

      if (task.title.substring(0, 19) !== "(Tout les jours) : ") {
        task.title = "(Tout les jours) : " + task.title
      }

      planningWithEvent = this._pushOneTaskInPlanning(planningWithEvent, task, dateTimeToPush, dateToPush);
    }
  }

  private _createWeekRecurrentTaskForPlanning(planningWithEvent : any, task : Task, today : Date) {
    for (let i = 0; i < 12 ; i++) {
      let dateBegin = new Date(task.dateBegin);

      let dateToPush = new Date(today.getFullYear(), today.getMonth(), today.getDate(),
        dateBegin.getHours(), dateBegin.getMinutes());

      let ajustDayOfTheWeek = dateBegin.getDay() - today.getDay();
      dateToPush.setDate(dateToPush.getDate() + ajustDayOfTheWeek);

      dateToPush.setDate(dateToPush.getDate() + (i * 7) );
      let dateTimeToPush = dateToPush.getTime();

      planningWithEvent = this._pushOneTaskInPlanning(planningWithEvent, task, dateTimeToPush, dateToPush);
    }
  }

  private _createMonthRecurrentTaskForPlanning(planningWithEvent : any, task : Task, today : Date) {
    const dateBegin = new Date(task.dateBegin);
    const month = today.getMonth();
    const year = today.getFullYear();

    for (let i = 0; i < 13 ; i++) {
      let targetDate = dateBegin.getDate();
      let targetMonth = month + i;
      let targetYear = year;

      if (targetMonth > 12) {
        targetMonth = targetMonth - 12;
        targetYear++;
      }

      let daysInTargetMonth = new Date(targetYear, targetMonth + 1, 0).getDate();

      if (targetDate > daysInTargetMonth) {
        targetDate = daysInTargetMonth;
      }

      let dateToPush = new Date(targetYear, targetMonth, targetDate,
        dateBegin.getHours(), dateBegin.getMinutes());

      let dateTimeToPush = dateToPush.getTime();

      planningWithEvent = this._pushOneTaskInPlanning(planningWithEvent, task, dateTimeToPush, dateToPush);
    }
  }

  private _createAnnualRecurrentTaskForPlanning(planningWithEvent : any, task : Task, today : Date) {
    for (let i = 0; i < 1 ; i++) {
      const dateBegin = new Date(task.dateBegin);
      const dateBeginTime = dateBegin.getTime();
      let date = new Date();
      let dateTime = date.getTime();

      let dateToPush = new Date(dateBegin.getFullYear(), dateBegin.getMonth(), dateBegin.getDate(),
        dateBegin.getHours(), dateBegin.getMinutes());

      if (dateTime > dateBeginTime) {
        dateToPush = new Date(dateBegin.getFullYear() + 1, dateBegin.getMonth(), dateBegin.getDate(),
          dateBegin.getHours(), dateBegin.getMinutes());
      }

      let dateTimeToPush = dateToPush.getTime();

      planningWithEvent = this._pushOneTaskInPlanning(planningWithEvent, task, dateTimeToPush, dateToPush);
    }
  }

  private _pushOneTaskInPlanning(planningWithEvent : any, task : Task, dateTime : number, dateBegin? : Date) {
    if (dateBegin) {
      task.dateBegin = dateBegin;
    }

    planningWithEvent.push({
      id: task.id,
      title: task.title,
      description: task.description,
      dateBegin: task.dateBegin,
      isRecurring: task.isRecurring,
      recurrence: task.recurrence,
      dateTime: dateTime
    })

    return planningWithEvent;
  }

  private _pushMeetsInPlanningWithEvent(meets : Meet[], planningWithEvent : any) {
    const currentDate = new Date();
    const currentDateTime = currentDate.getTime();
    let date = new Date();
    let dateTime = 0;
    let dateEnding = new Date();
    let dateTimeEnding = 0;

    for (let i = 0; i < meets.length; i++) {
      date = new Date(meets[i].dateBegin);
      dateTime = date.getTime();
      dateEnding = new Date(meets[i].dateEnding);
      dateTimeEnding = dateEnding.getTime();

      if ( (dateTimeEnding > currentDateTime && !meets[i].isRecurring) || meets[i].isRecurring ) {
        planningWithEvent.push({
          id: meets[i].id,
          title: meets[i].title,
          description: meets[i].description,
          dateBegin: meets[i].dateBegin,
          dateEnding: meets[i].dateEnding,
          isRecurring: meets[i].isRecurring,
          recurrence: meets[i].recurrence,
          dateTime: dateTime
        })
      }
    }

    return planningWithEvent;
  }

  private _sortEventForPlanning(planningWithEvent : any) {
    const date = new Date();
    const dateTime = date.getTime();

    planningWithEvent.sort((a : any, b : any) => a.dateTime - b.dateTime);
    planningWithEvent = planningWithEvent.filter((event: { dateTime: number; }) => event.dateTime >= dateTime);

    return planningWithEvent;
  }

  private _createMonthWithEvent(month: Day[]) {
    const monthWithEvent = [];

    for (let i = 0; i < month.length; i++) {
      monthWithEvent.push({
        day: month[i].day,
        month: month[i].month,
        year: month[i].year,
        theDay: month[i].theDay,
        events: [{}]
      });
    }

    return monthWithEvent;
  }

  private _createWeekWithEvent(week: Day[]) {
    const weekWithEvent = [];

    for (let i = 0; i < week.length; i++) {
      weekWithEvent.push({
        day: week[i].day,
        month: week[i].month,
        year: week[i].year,
        theDay: week[i].theDay,
        events: [{}]
      });
    }

    return weekWithEvent;
  }

  private _pushMeetsInDayWithEvent(meets : Meet[], dayWithEvent : any, day: Day) {
    const thisDay = new Date(day.year, day.month - 1, day.day);
    const thisDayTime = thisDay.getTime();
    let beginTime!:Date;
    let endingTime!:Date;
    let beginTimespan!:number;
    let endingTimespan!:number;
    let date!:Date;
    let dateTime!:number;

    for (let i = 0; i < meets.length; i++) {
      beginTime = new Date(meets[i].dateBegin);
      endingTime = new Date(meets[i].dateEnding);
      beginTimespan = beginTime.getTime() - 86400000;
      endingTimespan = endingTime.getTime();
      date = new Date(day.year, day.month, day.day, beginTime.getHours(), beginTime.getMinutes());
      dateTime = date.getTime();
      if (thisDayTime > beginTimespan && thisDayTime <= endingTimespan) {
        dayWithEvent.push({
          id: meets[i].id,
          title: meets[i].title,
          description: meets[i].description,
          dateBegin: meets[i].dateBegin,
          dateEnding: meets[i].dateEnding,
          isRecurring: meets[i].isRecurring,
          recurrence: meets[i].recurrence,
          dateTime: dateTime
        })
      }
    }

    return dayWithEvent;
  }

  private _getAllTasks() : Observable<ResAllTask> {
    return this._client.get<ResAllTask>(this.api + "tasks");
  }

  private _getAllMeets() : Observable<ResAllMeet> {
    return this._client.get<ResAllMeet>(this.api + "meets");
  }

  private _getUserId() {
    const token = localStorage.getItem('auth_token');
    const base64Url = token!.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const decodedToken = JSON.parse(window.atob(base64));
    return decodedToken.id;
  }

  private _fillMemberIdArray(userId : number, relation : Relation[]) {
    const MemberIdArray : number[] = []
    MemberIdArray.push(userId);

    for (let i=0; i<relation.length;i++){
      if (relation[i].isChecked) {
        MemberIdArray.push(relation[i].id);
      }
    }

    return MemberIdArray;
  }

  private _dateConstructorForAPI(date:DateEvent) {
    // Ensure leading zeros for single-digit values
    const month = String(date.month).padStart(2, '0');
    const day = String(date.day).padStart(2, '0');
    const hours = String(date.hours).padStart(2, '0');
    const minutes = String(date.minutes).padStart(2, '0');

    // Construct the date string
    return `${date.year}-${month}-${day}T${hours}:${minutes}:00`;
    return date.year + "-" + date.month + "-" + date.day + " " + date.hours + ":" + date.minutes + ":00";
  }

  private _dayDifference (first : Date, second : Date) {
    first.setHours(12);
    first.setMinutes(0);
    second.setHours(12);
    second.setMinutes(0);
    const one = new Date(first).getTime();
    const two = new Date(second).getTime();
    const difference_ms = Math.abs(one - two);

    return Math.round(difference_ms/86400000);
  }

  emitDateClick(date: Day) {
    this.dateClickSource.next(date);
  }


  initiateGoogleCalendarAddition(email: string) {
    return this._client.post<any>(this.api + "meets/add-gmail", {email})
  }

  getGmail() {
    return this._client.get<any>(this.api + "meets/gmail")
  }

  deleteGmailSync() {
    return this._client.delete<void>(this.api + "meets/gmail")
  }
}
