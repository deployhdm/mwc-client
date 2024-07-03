import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {DateService} from "../../services/date.service";
import {ErrorService} from "../../services/error.service";
import {Day} from "../../models/dateModel";
import {CalendarService} from "../../services/calendar.service";
import {RelationService} from "../../services/relation.service";
import {Relation} from "../../models/relationModel";
import {AlertService} from "../../services/alert.service";
import { environment } from 'src/environments/environment';
import { addHours, formatISO } from 'date-fns';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Meet } from 'src/app/models/calendarModel';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss', './calendar2.component.scss', './calendar3.component.scss'],
})

export class CalendarComponent implements OnInit {
  today!:string;
  day!:Day;
  week!:Day[];
  month!:Day[];
  year!:Day[][];
  displayBy:string = "week";
  displayScrollAddMenu:boolean = false;
  displayFriendsPicker:boolean = false;
  relation:Relation[]=[];
  classTaskChoose : string = "selected";
  classMeetChoose : string = "pointer";
  listDay : number[] = [];
  listMonth : number[] = [];
  listYear : number[] = [];
  listHour : number[] = [];
  listMinute : number[] = [];
  participant! : Relation[];
  titleEvent!:string;
  recurrence:string = "";
  descriptionEvent:string = "";
  dateBegin!:string;
  dateEnding!:string;
  currentYear!: number;
  isEventUpdate!:boolean;
  idForUpdate!:number;
  meetingLocationForm!: FormGroup;
  linkOrLocalisation!: string;
  displayGmailInput!: boolean;
  gmail!: string;
  gmailInput!: FormGroup; 
  gmailSync!: string;

  constructor(
    private _dateService: DateService,
    private _errorService: ErrorService,
    private _calendarService : CalendarService,
    private _relationService : RelationService,
    private _alertService : AlertService,
    private cdr: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private route : ActivatedRoute,
    private _router: Router,
  ) {}

  ngOnInit() {
    this.getWeek();
    this.fillFormAddEvent();
    this.getAllRelation();
    this.getUpdateEventEmitter();
    this.dateBegin = formatISO(new Date());
    this.dateEnding = formatISO(addHours(new Date(this.dateBegin), 1));
    this.meetingLocationForm = this.formBuilder.group({
      meetingLocationType: ['remote', Validators.required],
      linkOrLocalisation: ['', Validators.required]
    }),
    this._calendarService.dateClick$.subscribe(day => {
      this.dateBegin = formatISO(new Date(day.year, day.month - 1, day.day));
      this.dateEnding = formatISO(addHours(new Date(this.dateBegin), 1));
      this.displayAddMenu();
    });
    this.gmailInput = this.formBuilder.group({
      gmail: ['', [Validators.required, this.gmailValidator]]
    })
    this.getGmail();
    this.route.queryParams.subscribe(params => {
      if (params['error'] === 'google_sync_error') {
        console.log('Google sync ratée')
        this._calendarService.deleteGmailSync().subscribe({
          next: () => {
            this._alertService.alerte('Erreur synchronisation Google Calendar', 'Veuillez réessayer la synchronisation avec Google Calendar.')
            this.gmailSync = ''
            this._router.navigate(['home'])
          }
        })
      }
    })
  }

  getUpdateEventEmitter() {
    this._calendarService.getCallUpdateEventEmitter().subscribe( {
      next: (data) => {
        this.callUpdateEvent(data[0], data[1]);
      },
      error: (error) => {
        this._errorService.errorHandler(error);
      }
    })
  }

  getAllRelation() {
    this._relationService.getAllRelation().subscribe({
      next: (data) => {
        this.relation = data.result.friends;
        this.participant = data.result.friends;
        for (let i=0; i<this.participant.length; i++) {
          this.participant[0].isChecked = false;
          this.participant[i].isCheckedBlock = false;
        }
      },
      error: (error) =>{
        this._errorService.errorHandler(error);
      }
    })
  }

  validateDateEnding(): boolean {
    if (this.dateEnding > this.dateBegin) {
      return true;
    }
    this._alertService.alerte("Date de fin invalide", "La date de fin doit être après la date de début");
    return false
  }

  getLinkOrLocalisationValue(): string {
    return this.meetingLocationForm.get('linkOrLocalisation')?.value;
  }

  populateFormWithMeetingDetails(meet: Meet): void {
    this.meetingLocationForm.patchValue({
      linkOrLocalisation: meet.linkOrLocalisation 
    });
  }

  createEvent() {
    if (this.titleEvent === "" || !this.titleEvent) {
      this._alertService.alerte("Titre manquant","Vous devez entrer un titre");

      return;
    }

    if (this.descriptionEvent === "" || !this.deleteEvent) {
      this._alertService.alerte("Description manquante","Vous devez entrer une description");

      return;
    }

    if (this.classTaskChoose === "selected") {
      this._calendarService.createTask(this.titleEvent, this.descriptionEvent, this.dateBegin, this.recurrence,
        this.participant).subscribe({
        next: ()=> {
          this.clearFormAddEvent();
        },
        error: (error)=> {
          this._errorService.errorHandler(error);
        }
      })

    }

    if (this.classMeetChoose === "selected") {
      if (!(this.validateDateEnding())) {
        return;
      }
      const linkOrLocalisation = this.getLinkOrLocalisationValue()
      console.log(linkOrLocalisation)
      this._calendarService.createMeet(this.titleEvent, this.descriptionEvent, this.dateBegin, this.dateEnding, linkOrLocalisation, this.participant).subscribe({
        next: ()=> {
          this.clearFormAddEvent();
        },
        error: (error)=> {
          this._errorService.errorHandler(error);
        }
      })

    }
  }

  updateEvent() {
    if (this.titleEvent === "" || !this.titleEvent) {
      this._alertService.alerte("Titre manquant","Vous devez entrer un titre");

      return;
    }

    if (this.descriptionEvent === "" || !this.deleteEvent) {
      this._alertService.alerte("Description manquante","Vous devez entrer une description");

      return;
    }

    if (this.idForUpdate === 0 || !this.idForUpdate) {
      this._alertService.alerte("Id inexistant","Cet événement n'existe pas !!!");

      return;
    }

    if (this.classTaskChoose === "selected") {
      this._calendarService.updateTask(this.titleEvent, this.descriptionEvent, this.dateBegin, this.recurrence, this.participant, this.idForUpdate).subscribe({
        next: ()=> {
          this.clearFormAddEvent();
        },
        error: (error)=> {
          this._errorService.errorHandler(error);
        }
      })
    }

    if (this.classMeetChoose === "selected") {
      const linkOrLocalisation = this.getLinkOrLocalisationValue();
      this._calendarService.updateMeet(this.titleEvent, this.descriptionEvent, this.dateBegin, this.dateEnding, this.participant, this.idForUpdate, linkOrLocalisation).subscribe({
        next: ()=> {
          this.clearFormAddEvent();
        },
        error: (error)=> {
          this._errorService.errorHandler(error);
        }
      })

    }
  }

  deleteEvent() {
    if (this.idForUpdate === 0 || !this.idForUpdate) {
      this._alertService.alerte("Id inexistant","Cet événement n'existe pas !!!");

      return;
    }

    if (this.classTaskChoose === "selected") {
      this._calendarService.deleteTask(this.idForUpdate).subscribe({
        next: ()=> {
          this.clearFormAddEvent();
          this._alertService.alerte("Tâche supprimée","Cette tâche a bien été supprimée pour vous. Si d'autres " +
            "personnes partageaient cette tâche avec vous, elle existe toujours pour eux.");
          this.clearFormAddEvent();
        },
        error: (error)=> {
          this._errorService.errorHandler(error);
        }
      })

    }

    if (this.classMeetChoose === "selected") {
      this._calendarService.deleteMeet(this.idForUpdate).subscribe({
        next: ()=> {
          this.clearFormAddEvent();
          this._alertService.alerte("Evènement supprimée","Cet évènement a bien été supprimée pour vous. Si d'autres " +
            "personnes partageaient cet évènement avec vous, il existe toujours pour eux.");
          this.clearFormAddEvent();
        },
        error: (error)=> {
          this._errorService.errorHandler(error);
        }
      })

    }
  }

  callUpdateEvent(id : number, dateEnding : any) {
    let typeEvent!:string;
    if (dateEnding === undefined) typeEvent = "task";
    if (dateEnding !== undefined) typeEvent = "meet";

    this.getAllRelation();

    if (typeEvent === "task") {
      this.classTaskChoose = "selected";
      this.classMeetChoose = "pointer";

      this._calendarService.getOneTask(id).subscribe({
        next: (tasks) => {
          const task = tasks.result.task[0];
          if (task.recurrence === null) task.recurrence="";
          const dateBegin = new Date (task.dateBegin)
          this.idForUpdate = task.id;
          this.titleEvent = task.title;
          this.dateBegin = formatISO(dateBegin);
          this.isEventUpdate = true;
          this.descriptionEvent = task.description;
          this.recurrence = task.recurrence;
          this.participant.forEach(function(obj) {
            if (task.MemberId!.includes(obj.id)) {
              obj.isChecked = true;
              obj.isCheckedBlock = true;
            }
          });

          this.displayAddMenu();
        }
      })
    }

    if (typeEvent === "meet") {
      this.classTaskChoose = "pointer";
      this.classMeetChoose = "selected";

      this._calendarService.getOneMeet(id).subscribe({
        next: (meets) => {
          const meet = meets.result.meet[0];
          const dateBegin = new Date (meet.dateBegin)
          const dateEnding = new Date (meet.dateEnding)
          this.idForUpdate = meet.id;
          this.titleEvent = meet.title;
          this.dateBegin = formatISO(dateBegin);
          this.dateEnding = formatISO(dateEnding);
          this.isEventUpdate = true;
          this.descriptionEvent = meet.description;
          this.recurrence = meet.recurrence;
          this.participant.forEach(function(obj) {
            if (meet.MemberId!.includes(obj.id)) {
              obj.isChecked = true;
              obj.isCheckedBlock = true;
            }
          });
          this.populateFormWithMeetingDetails(meet);
          this.displayAddMenu();
        }
      })
    }
  }

  clearFormAddEvent() {
    this.displayScrollAddMenu = false;
    this.titleEvent = "";
    this.descriptionEvent = "";
    this.recurrence = "";
    this.idForUpdate = 0;
    this.isEventUpdate = false;
    this.participant.forEach(function(obj) {
      obj.isChecked = false;
    });
    this.getAllRelation();
  }

  // gestion des dates
  getDay() {
    this.day = this._dateService.getDay();
    this.currentYear = this.day.year;
  }

  getWeek() {
    this.week = this._dateService.getWeek();
    this.currentYear = this.week[0].year;
  }

  getMonth() {
    this.month = this._dateService.getMonth();
    this.currentYear = this.month[0].year;
  }

  getYear() {
    this.year = this._dateService.getYear();
    this.currentYear = this.year[0][0].year;
  }

  getNext(){
    if (this.displayBy === "day") {
      this.day = this._dateService.getNextDay();
      this.cdr.detectChanges();
      this._calendarService.emitCalendarDateChange();
      this.currentYear = this.day.year;
    }

    if (this.displayBy === "week") {
      this.week = this._dateService.getNextWeek();
      this.cdr.detectChanges();
      this._calendarService.emitCalendarDateChange();
      this.currentYear = this.week[0].year;
    }

    if (this.displayBy === "month") {
      this.month = this._dateService.getNextMonth();
      this.cdr.detectChanges();
      this._calendarService.emitCalendarDateChange();
      this.currentYear = this.month[0].year;
    }

    if (this.displayBy === "year") {
      this.year = this._dateService.getNextYear();
      this.currentYear = this.year[0][0].year;
    }
  }

  getPrevious(){
    if (this.displayBy === "day") {
      this.day = this._dateService.getPreviousDay();
      this.cdr.detectChanges();
      this._calendarService.emitCalendarDateChange();
      this.currentYear = this.day.year;
    }

    if (this.displayBy === "week") {
      this.week = this._dateService.getPreviousWeek();
      this.cdr.detectChanges();
      this._calendarService.emitCalendarDateChange();
      this.currentYear = this.week[0].year;
    }

    if (this.displayBy === "month") {
      this.month = this._dateService.getPreviousMonth();
      this.cdr.detectChanges();
      this._calendarService.emitCalendarDateChange();
      this.currentYear = this.month[0].year;
    }

    if (this.displayBy === "year") {
      this.year = this._dateService.getPreviousYear();
      this.currentYear = this.year[0][0].year;
    }
  }

  getReturnToday(){
    if (this.displayBy === "day") {
      this.day = this._dateService.getReturnTodayForDay();
      this.currentYear = this.day.year;
    }

    if (this.displayBy === "week") {
      this.week = this._dateService.getReturnTodayForWeek();
      this.currentYear = this.week[0].year;
    }

    if (this.displayBy === "month") {
      this.month = this._dateService.getReturnTodayForMonth();
      this.currentYear = this.month[0].year;
    }

    if (this.displayBy === "year") {
      this.year = this._dateService.getReturnTodayForYear();
      this.currentYear = this.year[0][0].year;
    }

    this.cdr.detectChanges();
    this._calendarService.emitCalendarDateChange();
  }

  updateDisplayBy(value: string) {
    if (this.displayBy === "day") this.getDay();
    if (this.displayBy === "week") this.getWeek();
    if (this.displayBy === "month") this.getMonth();
    if (this.displayBy === "year") this.getYear();

    this.displayBy = value;
    document.querySelector('.scrollToMe')!.scrollIntoView({behavior: 'smooth', block: 'start'});
  }

  // display

  chooseAddTask() {
    this.classTaskChoose = "selected";
    this.classMeetChoose = "pointer";
  }

  chooseAddMeet() {
    this.classTaskChoose = "pointer";
    this.classMeetChoose = "selected";
  }

  fillFormAddEvent() {
    for (let i=1; i<32; i++) {
      this.listDay.push(i);
    }

    for (let i=1; i<13; i++) {
      this.listMonth.push(i);
    }

    const date = new Date();
    const thisYear = date.getFullYear();

    for (let i=thisYear; i<thisYear+40; i++) {
      this.listYear.push(i);
    }

    for (let i=0; i<24; i++) {
      this.listHour.push(i);
    }

    for (let i=0; i<60; i++) {
      this.listMinute.push(i);
    }

    // this.dateBegin = {
    //   day:1,
    //   month:1,
    //   year:2023,
    //   hours:12,
    //   minutes:0
    // };

    // this.dateEnd = {
    //   day:1,
    //   month:1,
    //   year:2023,
    //   hours:12,
    //   minutes:0
    // };
  }

  displayAddMenu() {
    this.displayScrollAddMenu = true;
  }

  hideAddMenu() {
    this.displayScrollAddMenu = false;
    this.isEventUpdate = false;
    this.participant.forEach(function(obj) {
        obj.isChecked = false;
    });
    this.idForUpdate = 0;
  }

  hideFriendsPicker() {
    this.displayFriendsPicker = false;
  }

  showFriendsPicker() {
    this.displayFriendsPicker = true;
  }

  displayGmailMenu() {
    this.displayGmailInput = true;
  }

  hideGmailMenu() {
    this.displayGmailInput = false;
    this.gmail = '';
  }

  gmailValidator(control: any) {
    const email = control.value
    if (!email) {
      return null;
    }
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail.com$/i;
    if (!gmailRegex.test(email)) {
      return { invalidGmail: true };
    }

    return null;
  }

  initiateGoogleCalendarAddition() {
    this._calendarService.initiateGoogleCalendarAddition(this.gmail).subscribe({
      next: () => {
        const url = `${environment.api}auth/google/login`
        window.location.href = url
      },
      error: (error) => {
        this._alertService.alerte('Erreur initation synchronisation Google', 'La synchronisation ne peut pas se faire.')
      }
    })
  }
  
  getGmail() {
    console.log('Fetching gmail if synchronized...')
    this._calendarService.getGmail().subscribe({
      next: (data) => {
        this.gmailSync = data.result
        console.log(data.result)
      }
    })
  }

  deleteGmailSync(){
    this._calendarService.deleteGmailSync().subscribe({
      next: () => {
        this._alertService.alerte('Google Calendar supprimé', 'La synchronisation avec Gooogle Calendar a été supprimée')
        this.gmailSync = ''
        location.reload();
      }
    })
  }
}
