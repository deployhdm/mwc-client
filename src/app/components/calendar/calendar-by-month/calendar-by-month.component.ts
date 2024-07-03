import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Day} from "../../../models/dateModel";
import {Meet, Task} from "../../../models/calendarModel";
import {CalendarService} from "../../../services/calendar.service";
import {ErrorService} from "../../../services/error.service";


@Component({
  selector: 'app-calendar-by-month',
  templateUrl: './calendar-by-month.component.html',
  styleUrls: ['./calendar-by-month.component.scss'],
})
export class CalendarByMonthComponent implements OnInit {
  @Input() month!: Day[];
  allPlanned!: { tasks : Task[], meets : Meet[]};
  monthWithEvent!: any;

  constructor(
    private _calendarService : CalendarService,
    private _errorService : ErrorService
  ) { }

  ngOnInit() {
    this.getAllPlanned();
    this.getEmitter();
    this.getMonthChangeEmitter();
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

  getMonthChangeEmitter() {
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
    this._calendarService.filterEventForThisMonth(this.allPlanned, this.month).subscribe({
      next: (data) => {
        this.monthWithEvent = data;
      },
      error: (error) => {
        this._errorService.errorHandler(error);
      }
    })
  }

  callUpdateEvent(id : number, dateEnding : any) {
    this._calendarService.callUpdateEventEmit(id, dateEnding);
  }

  displayAddMenu(date: Day) {
    this._calendarService.emitDateClick(date);
  }
}
