import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DateService{
  day!:number;
  month!:number;
  year!:number;
  theDay!:number;
  yearObservable : BehaviorSubject<number> = new BehaviorSubject<number>(this.year);

  constructor() {
    this._getDateOfDay();
  }

  private _getDateOfDay() {
    const date = new Date();
    this.day = date.getDate();
    this.month = date.getMonth() + 1;
    this.year = date.getFullYear();
    this.theDay = date.getDay();
  }

  getYearObservable() :Observable<number>{
    return this.yearObservable;
  }

  getDateCurrent() {
    return `${this.day} ${this.month} ${this.year}`;
  }

  getReturnTodayForDay() {
    this._getDateOfDay();
    return this.getDay();
  }

  getReturnTodayForWeek() {
    this._getDateOfDay();
    return this.getWeek();
  }

  getReturnTodayForMonth() {
    this._getDateOfDay();
    return this.getMonth();
  }

  getReturnTodayForYear() {
    this._getDateOfDay();
    return this.getYear();
  }

  getNextDay() {
    this.day = this.day + 1;
    this._updateDayUpCheck();

    return this.getDay();
  }

  getNextWeek() {
    this.day = this.day + 7;
    this._updateDayUpCheck();

    return this.getWeek();
  }

  getNextMonth() {
    this.month = this.month + 1;

    if (this.month > 12) {
      this.month = 1;
      this.year++;
    }

    return this.getMonth();
  }

  getNextYear() {
    this.year = this.year + 1;
    this.yearObservable.next(this.year);

    return this.getYear();
  }

  getPreviousDay() {
    this.day = this.day - 1;
    this._updateDayDownCheck();

    return this.getDay();
  }

  getPreviousWeek() {
    this.day = this.day - 7;
    this._updateDayDownCheck();

    return this.getWeek();
  }

  getPreviousMonth() {
    this.month = this.month - 1;

    if (this.month < 1) {
      this.month = 12;
      this.year--;
    }

    return this.getMonth();
  }

  getPreviousYear() {
    this.year = this.year - 1;
    this.yearObservable.next(this.year);

    return this.getYear();
  }

  getDay() {
    const datePlus0:number[] = this._datePlus0();

    return {
          "day": datePlus0[0],
          "month": datePlus0[1],
          "year": datePlus0[2],
          "theDay": this.makeTheDay(this.theDay)
        }
  }

  getWeek() {
    const dateMinus2:number[] = this._dateMinus2();
    const dateMinus1:number[] = this._dateMinus1();
    const datePlus0:number[] = this._datePlus0();
    const datePlus1:number[] = this._datePlus1();
    const datePlus2:number[] = this._datePlus2();
    const datePlus3:number[] = this._datePlus3();
    const datePlus4:number[] = this._datePlus4();

    return [
      {
        "day": dateMinus2[0],
        "month": dateMinus2[1],
        "year": dateMinus2[2],
        "theDay": this.makeTheDay(dateMinus2[3])
      },
      {
        "day": dateMinus1[0],
        "month": dateMinus1[1],
        "year": dateMinus1[2],
        "theDay": this.makeTheDay(dateMinus1[3])
      },
      {
        "day": datePlus0[0],
        "month": datePlus0[1],
        "year": datePlus0[2],
        "theDay": this.makeTheDay(datePlus0[3])
      },
      {
        "day": datePlus1[0],
        "month": datePlus1[1],
        "year": datePlus1[2],
        "theDay": this.makeTheDay(datePlus1[3])
      },
      {
        "day": datePlus2[0],
        "month": datePlus2[1],
        "year": datePlus2[2],
        "theDay": this.makeTheDay(datePlus2[3])
      },
      {
        "day": datePlus3[0],
        "month": datePlus3[1],
        "year": datePlus3[2],
        "theDay": this.makeTheDay(datePlus3[3])
      },
      {
        "day": datePlus4[0],
        "month": datePlus4[1],
        "year": datePlus4[2],
        "theDay": this.makeTheDay(datePlus4[3])
      }
    ]
  }

  getMonth() {
    this.day = 1;
    let limit:number = 0;
    const myDate = new Date(this.year, this.month-1, 1);
    this.theDay = myDate.getDay();

    if (this.month === 1 || this.month === 3 || this.month === 5 || this.month === 7 || this.month === 8 || this.month === 10 || this.month === 12) {
      limit = 31;
    }

    if (this.month === 4 || this.month === 6 || this.month === 9 || this.month === 11) {
      limit = 30;
    }

    if (this.month === 2 && this._isBissextilesYear(this.year)) {
      limit = 29;
    }

    if (this.month === 2 && !this._isBissextilesYear(this.year)) {
      limit = 28;
    }

    let monthToReturn = [];

    for (let i=1; i<=limit; i++) {
      monthToReturn.push(this.getDay());

      this.day++;
      this.theDay++;

      if (this.theDay > 6) {
        this.theDay = 0;
      }

    }

    this.day = 1;

    return monthToReturn;
  }

  getYear() {
    this.day = 1;
    this.month = 1;
    const myDate = new Date(this.year, 1, 1);
    this.theDay = myDate.getDay();

    let yearToReturn = [];

    for (let i=1; i<=12; i++) {
      yearToReturn.push(this.getMonth());

      this.month++;
    }

    this.day=1;
    this.month=1;
    this.yearObservable.next(this.year);

    return yearToReturn;
  }

  private _updateDayDownCheck() {
    if (this.day < 1) {
      const newDayToday = this._checkDay(this.day, this.month, this.year, this.theDay);
      this.day = newDayToday[0];
      this.month = newDayToday[1];
      this.year = newDayToday[2];
    }
  }

  private _updateDayUpCheck() {
    if (this.day > 28) {
      const newDayToday = this._checkDay(this.day, this.month, this.year, this.theDay);
      this.day = newDayToday[0];
      this.month = newDayToday[1];
      this.year = newDayToday[2];
    }
  }

  private _dateMinus2() {
    const day = this.day - 2;
    const theDay = this.theDay - 2;
    return this._checkDay(day, this.month, this.year, theDay);
  }

  private _dateMinus1() {
    const day = this.day - 1;
    const theDay = this.theDay - 1;
    return this._checkDay(day, this.month, this.year, theDay);
  }

  private _datePlus0() {
    const day = this.day;
    const theDay = this.theDay;
    return this._checkDay(day, this.month, this.year, theDay);
  }

  private _datePlus1() {
    const day = this.day + 1;
    const theDay = this.theDay + 1;
    return this._checkDay(day, this.month, this.year, theDay);
  }

  private _datePlus2() {
    const day = this.day + 2;
    const theDay = this.theDay + 2;
    return this._checkDay(day, this.month, this.year, theDay);
  }

  private _datePlus3() {
    const day = this.day + 3;
    const theDay = this.theDay + 3;
    return this._checkDay(day, this.month, this.year, theDay);
  }

  private _datePlus4() {
    const day = this.day + 4;
    const theDay = this.theDay + 4;
    return this._checkDay(day, this.month, this.year, theDay);
  }

  private _checkDay(day:number, month:number, year:number, theDay:number) {
    let dayReturn: number = day;
    let monthReturn: number = month;
    let yearReturn: number = year;

    if (day<1) {
      if (month === 1) {
        dayReturn = 31 + day;
        monthReturn = 12;
        yearReturn = year - 1;
      }

      if (month === 2 || month === 4 || month === 6 || month === 8 || month === 9 || month === 11 ) {
        dayReturn = 31 + day;
        monthReturn = month - 1;
      }

      if (month === 5 || month === 7 || month === 10 || month === 12) {
        dayReturn = 30 + day;
        monthReturn = month - 1;
      }

      if (month === 3) {
        if (this._isBissextilesYear(year)) {
          dayReturn = 29 + day;
          monthReturn = month - 1;
        }
        else {
          dayReturn = 28 + day;
          monthReturn = month - 1;
        }
      }
    }

    if (day > 31 && (month === 1 || month === 3 || month === 5 || month === 7 || month === 8 || month === 10)) {
      dayReturn = day - 31;
      monthReturn = month + 1;
    }

    if (day > 31 && month === 12) {
      dayReturn = day - 31;
      monthReturn = 1;
      yearReturn = year + 1;
    }

    if (day > 30 && (month === 4 || month === 6 || month === 9 || month === 11 || month === 10)) {
      dayReturn = day - 30;
      monthReturn = month + 1;
    }

    if (this._isBissextilesYear(year) && (day > 29 && month === 2)) {
      dayReturn = day - 29;
      monthReturn = 3;
    }

    if (!this._isBissextilesYear(year) && (day > 28 && month === 2)) {
      dayReturn = day - 28;
      monthReturn = 3;
    }

    let findTheDay = new Date (yearReturn, monthReturn-1, dayReturn);
    theDay = findTheDay.getDay();
    this.theDay = theDay;

    return [dayReturn, monthReturn, yearReturn, theDay];
  }

  private _isBissextilesYear(year: number): boolean {
    return ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);
  }

  makeTheDay(theDay:number) :string {
    if (theDay === 0 || theDay === 7) return "Dimanche";
    if (theDay === 1 || theDay === 8) return "Lundi";
    if (theDay === 2 || theDay === 9) return "Mardi";
    if (theDay === 3 || theDay === 10) return "Mercredi";
    if (theDay === 4) return "Jeudi";
    if (theDay === 5 || theDay === -2) return "Vendredi";
    if (theDay === 6 || theDay === -1) return "Samedi";
    return "";
  }

}
