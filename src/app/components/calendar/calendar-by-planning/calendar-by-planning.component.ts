import { Component, OnInit } from '@angular/core';
import {CalendarService} from "../../../services/calendar.service";
import {ErrorService} from "../../../services/error.service";
import {Meet, Task} from "../../../models/calendarModel";

@Component({
  selector: 'app-calendar-by-planning',
  templateUrl: './calendar-by-planning.component.html',
  styleUrls: ['./calendar-by-planning.component.scss'],
})
export class CalendarByPlanningComponent implements OnInit {
  allPlanned!:{ tasks : Task[], meets : Meet[]};
  planning!:any;

  constructor(
    private _calendarService : CalendarService,
    private _errorService : ErrorService
  ) { }

  ngOnInit() {
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
        this.filterAllPlanned();
      },
      error: (error) => {
        this._errorService.errorHandler(error);
      }
    })
  }

  filterAllPlanned() {
    this._calendarService.filterEventForPlanning(this.allPlanned).subscribe({
      next: (data) => {
        this.planning = data;
      },
      error: (error) => {
        this._errorService.errorHandler(error);
      }
    })
  }

  callUpdateEvent(id : number, dateEnding : any) {
    this._calendarService.callUpdateEventEmit(id, dateEnding);
  }

}
