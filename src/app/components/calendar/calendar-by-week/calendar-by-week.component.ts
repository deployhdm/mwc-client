import { Component, OnInit, Input } from '@angular/core';
import {Day} from "../../../models/dateModel";
import {Meet, Task} from "../../../models/calendarModel";
import {CalendarService} from "../../../services/calendar.service";
import {ErrorService} from "../../../services/error.service";

@Component({
  selector: 'app-calendar-by-week',
  templateUrl: './calendar-by-week.component.html',
  styleUrls: ['./calendar-by-week.component.scss'],
})
export class CalendarByWeekComponent implements OnInit {
  @Input() week!: Day[];
  allPlanned!: { tasks : Task[], meets : Meet[]};
  planning!:any;

  constructor(
    private _calendarService : CalendarService,
    private _errorService : ErrorService
  ) { }

  ngOnInit() {
    this.getAllPlanned();
    this.getEmitter();
    this.getWeekChangeEmitter();
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

  getWeekChangeEmitter() {
    this._calendarService.getCalendarDateChangeEmitter().subscribe( {
      next: () => {
        this.filterAllPlanned();
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
        this.filterAllPlanned();
      },
      error: (error) => {
        this._errorService.errorHandler(error);
      }
    })
  }

  filterAllPlanned() {
    this._calendarService.filterEventForThisWeek(this.allPlanned, this.week).subscribe({
      next: (data) => {
        this.planning = data;
      },
      error: (error) => {
        this._errorService.errorHandler(error);
      }
    })
  }

  eventClass(i : number, j:number) {
    if (i === 0) {
      return "oneEventHide";
    }

    if (j % 2 === 0) {
      return "oneEventOdd";
    }

    return "oneEventEven";
  }

  callUpdateEvent(id : number, dateEnding : any) {
    this._calendarService.callUpdateEventEmit(id, dateEnding);
  }

  displayAddMenu(date: Day) {
    this._calendarService.emitDateClick(date);
  }
}
