import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Day} from "../../../models/dateModel";
import {Meet, Task} from "../../../models/calendarModel";
import {CalendarService} from "../../../services/calendar.service";
import {ErrorService} from "../../../services/error.service";

@Component({
  selector: 'app-calendar-by-day',
  templateUrl: './calendar-by-day.component.html',
  styleUrls: ['./calendar-by-day.component.scss'],
})
export class CalendarByDayComponent implements OnInit {
  @Input() day!: Day;
  allPlanned!: { tasks : Task[], meets : Meet[]};
  planning!:any;

  constructor(
    private _calendarService : CalendarService,
    private _errorService : ErrorService
  ) { }

  ngOnInit() {
    this.getAllPlanned();
    this.getEmitter();
    this.getDayChangeEmitter();
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

  getDayChangeEmitter() {
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
    this._calendarService.filterEventForThisDay(this.allPlanned, this.day).subscribe({
      next: (data) => {
        this.planning = data;
      },
      error: (error) => {
        this._errorService.errorHandler(error);
      }
    })
  }

  eventClass(i : number) {
    if (i === 0) {
      return "eventHide";
    }

    return "event";
  }

  callUpdateEvent(id : number, dateEnding : any) {
    this._calendarService.callUpdateEventEmit(id, dateEnding);
  }

}
