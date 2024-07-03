import {Component, Input, OnInit} from '@angular/core';
import {Day} from "../../../models/dateModel";
import {DateService} from "../../../services/date.service";
import {Meet, Task} from "../../../models/calendarModel";
import {CalendarService} from "../../../services/calendar.service";
import {ErrorService} from "../../../services/error.service";

@Component({
  selector: 'app-calendar-by-year',
  templateUrl: './calendar-by-year.component.html',
  styleUrls: ['./calendar-by-year.component.scss'],
})
export class CalendarByYearComponent implements OnInit {
  @Input() year!: Day[][];
  allPlanned!: { tasks : Task[], meets : Meet[]};
  currentYear!: number;
  displayModalDay:boolean = false;
  planning!:any;
  day!: Day;

  constructor(
    private _dateService : DateService,
    private _calendarService : CalendarService,
    private _errorService : ErrorService
  ) { }

  ngOnInit() {
    this.getYear();
    this.getAllPlanned();
    this.getEmitter();
  }

  getEmitter() {
    this._calendarService.getCalendarUpdateEmitter().subscribe( {
      next: () => {
        this.getAllPlanned();
      },
      error: (error) => {
        this._errorService.errorHandler(error);
      }
    })
  }

  getAllPlanned() {
    this._calendarService.getAllPlanned().subscribe({
      next: (data) => {
        this.allPlanned = { tasks : data[0].result.tasks, meets : data[1].result.meets };
      },
      error: (error) => {
        this._errorService.errorHandler(error);
      }
    })
  }

  getYear() {
    this._dateService.getYearObservable().subscribe({
      next: (data) => {
        this.currentYear = data;
      }
    });
  }

  getOneDay() {
    this._calendarService.filterEventForThisDay(this.allPlanned, this.day).subscribe({
      next: (data) => {
        this.planning = data;
      },
      error: (error) => {
        this._errorService.errorHandler(error);
      }
    })
  }

  displayOneDate(day : number, month : number, year : number, theDay : string) {
    this.displayDayModal();
    this.day = {
      day: day,
      month: month,
      year: year,
      theDay: theDay
    }

    this.getOneDay();
  }

  displayDayModal() {
    this.displayModalDay = true;
  }

  hideDayModal() {
    this.displayModalDay = false;
  }

  eventClass(i : number) {
    if (i === 0) {
      return "eventHide";
    }

    return "event";
  }
}
