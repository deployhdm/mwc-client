import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {AlertService} from "./alert.service";

@Injectable({
  providedIn: 'root'
})
export class CalculatorService {
  calculate:any[]=[];
  isOpenObservable : BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  result : BehaviorSubject<string> = new BehaviorSubject<string>("0");
  calculHistory : BehaviorSubject<string> = new BehaviorSubject<string>("0");
  number1Decimal:boolean | null = null;
  number2Decimal:boolean | null = null;

  constructor(
    private _alertService : AlertService
  ) { }

  toogleIsOpen() {
    this.isOpenObservable.next(!this.isOpenObservable.value);
  }

  touch(button: string | number) {
    if (typeof button === "number") {
      this.handleNumber(button.toString());

      return;
    }

    this.handleAction(button);
  }

  pressKey(key:string) {
    if (key === "0" || key === "1" || key === "2" || key === "3" || key === "4" || key === "5" || key === "6" || key === "7" ||
      key === "8" || key === "9") {
      this.handleNumber(key);

      return;
    }

    switch (key) {
      case "+" : this.handleAction('addition');
        break;
      case "-" : this.handleAction('substraction');
        break;
      case "*" : this.handleAction('multiplication');
        break;
      case "/" : this.handleAction('division');
        break;
      case "%" : this.handleAction('percentage');
        break;
      case "Backspace" : this.handleAction('delete');
        break;
      case "." : this.handleAction('decimal');
        break;
      case "," : this.handleAction('decimal');
        break;
      case "=" : this.handleAction('equal');
        break;
      case "Enter" : this.handleAction('equal');
        break;
      default: return;
    }

    return;
  }

  handleNumber(number:string) {
    if (this.calculHistory.value === '0') {
      this.calculHistory.next(number);

      if (number !== '0') {
        this.calculate.push(Number(number));
      }

      return;
    }

    if (this.calculHistory.value === '0.') {
      this.calculHistory.next("0." + number);
      this.calculate.push(Number("0." + number));

      return;
    }

    if(this.calculate.length === 1 && this.number1Decimal !== true) {
      this.calculate[0] = Number (this.calculate[0].toString() + number);
    }

    if(this.calculate.length === 3 && this.number2Decimal !== true) {
      this.calculate[2] = Number (this.calculate[2].toString() + number);
    }

    if(this.calculate.length === 2) {
      this.calculate[2] = Number (number);
    }

    if(this.calculate.length === 1 && this.number1Decimal === true) {
      this.calculate[0] = Number (this.calculate[0].toString() + "." + number);
      this.number1Decimal = false;
    }

    if(this.calculate.length === 3 && this.number2Decimal === true) {
      this.calculate[2] = Number (this.calculate[2].toString() + "." + number);
      this.number2Decimal = false;
    }

    this.calculHistory.next(this.calculHistory.value + number);
  }

  handleAction(action:string) {
    if (action === "addition") {
      this.operator("addition");
    }

    if (action === "substraction") {
      this.operator("substraction");
    }

    if (action === "multiplication") {
      this.operator("multiplication");
    }

    if (action === "division") {
      this.operator("division");
    }

    if (action === "equal") {
      this.equal();
    }

    if (action === "C") {
      this.reloadAfterEqual(0);
    }

    if (action === "CE") {
      this.CE();
    }

    if (action === "delete") {
      this.delete();
    }

    if (action === "negative") {
      this.negative();
    }

    if (action === "percentage") {
      this.percentage();
    }

    if (action === "decimal") {
      this.decimal();
    }
  }

  operator(operator:string) {
    let symbol = "";
    if (operator === "addition") {
      symbol = " + ";
    }

    if (operator === "substraction") {
      symbol = " - ";
    }

    if (operator === "division") {
      symbol = " / ";
    }

    if (operator === "multiplication") {
      symbol = " * ";
    }

    if(this.calculate.length === 1) {
      this.calculHistory.next(this.calculHistory.value + symbol);
      this.calculate.push(operator);

      return;
    }

    if(this.calculate.length === 2) {
      this.calculHistory.next(this.calculHistory.value.substring(0, this.calculHistory.value.length - 3) + symbol);
      this.calculate[1] = operator;

      return;
    }

    if(this.calculate.length === 3) {
      this.equal();
      this.calculate[1] = operator;
      this.calculHistory.next(this.calculHistory.value + symbol);
    }

    return;
  }

  CE() {
    if(this.calculate.length < 2) {
      this.reloadAfterEqual(0);

      return;
    }

    this.reloadAfterNumber2Change();

    return;
  }

  delete() {
    if(this.calculate.length === 1) {
      let newNumber = this.calculate[0].toString().substring(0, this.calculate[0].toString().length - 1);

      if (newNumber === "") {
        this.calculate.length = 0;
        this.calculHistory.next("0");

        return;
      }

      if (!Number.isInteger( this.calculate[0] ) && newNumber.substring(newNumber.length - 1) === "." ) {
        this.number1Decimal = null;
      }

      this.calculate[0] = Number(newNumber);
      this.calculHistory.next(this.calculate[0]);
    }

    if(this.calculate.length === 3) {
      let newNumber = this.calculate[2].toString().substring(0, this.calculate[2].toString().length - 1);

      if (newNumber === "") {
        this.reloadAfterNumber2Change();

        return;
      }

      if (!Number.isInteger( this.calculate[2] ) && newNumber.substring(newNumber.length - 1) === "." ) {
        this.number2Decimal = null;
      }

      this.reloadAfterNumber2Change();
      this.calculate[2] = Number(newNumber);
      this.calculHistory.next(this.calculHistory.value + this.calculate[2]);
    }
  }

  negative() {
    if(this.calculate.length === 1) {
      this.calculate[0] = this.inverseNumber(this.calculate[0]);
      this.calculHistory.next(this.calculate[0]);
    }

    if(this.calculate.length === 3) {
      const newNumber = this.inverseNumber(this.calculate[2]);
      this.reloadAfterNumber2Change();
      this.calculate[2] = newNumber;
      this.calculHistory.next(this.calculHistory.value + newNumber);
    }
  }

  percentage() {
    if(this.calculate.length === 1) {
      this.calculate[0] = this.calculate[0] / 100;
      this.calculHistory.next(this.calculate[0]);
    }

    if (this.calculate.length === 3) {
      if (this.calculate[1] === "multiplication" || this.calculate[1] === "division") {
        this.calculate[2] = this.calculate[2] / 100;
        this.equal();
      }

      if (this.calculate[1] === "addition") {
        this.calculate[2] = 1 + (this.calculate[2] / 100);
        this.calculate[1] = "multiplication";
        this.equal();
      }

      if (this.calculate[1] === "substraction") {
        this.calculate[2] = this.calculate[0] * (this.calculate[2] / 100) ;
        this.equal();
      }
    }
  }

  decimal() {
    if(this.calculate.length === 0) {
      this.number1Decimal = true;
      this.calculHistory.next("0.");
    }

    if(this.calculate.length === 1 && this.number1Decimal === null) {
      this.number1Decimal = true;
      this.calculHistory.next(this.calculate[0] + ".");
    }

    if(this.calculate.length === 3 && this.number2Decimal === null) {
      this.number2Decimal = true;
      this.calculHistory.next(this.calculHistory.value + ".");
    }
  }




  equal(){
    if(this.calculate.length === 3) {
      const number1 = Number(this.calculate[0]);
      const number2 = Number(this.calculate[2]);
      const operator = this.calculate[1];
      let result = 0;

      if(operator === "division") {
        if (number2 === 0) {
          this._alertService.alerte("Division par zéro", "La division par zéro est impossible !!");
          this.reloadAfterEqual(0);

          return;
        }

        result = number1 / number2;
      }

      if(operator === "addition") {
        result = number1 + number2;
      }

      if(operator === "substraction") {
        result = number1 - number2;
      }

      if(operator === "multiplication") {
        result = number1 * number2;
      }

      this.reloadAfterEqual(result);

      return;
    }

  }

  reloadAfterEqual(result: number) {
    this.calculate.splice(0, this.calculate.length);
    if (result !== 0) {
      this.calculate[0] = result;
    }

    this.number1Decimal = null;
    this.number2Decimal = null;

    if (!Number.isInteger(result)) {
      this.number1Decimal = false;
    }

    this.result.next(result.toString());
    this.calculHistory.next(result.toString());
  }

  reloadAfterNumber2Change() {
    const operator = this.calculate[1];
    this.calculate.length = 1;
    this.calculHistory.next(this.calculate[0]);
    this.number2Decimal = null;

    if (operator === "addition") {
      this.operator("addition");
    }

    if (operator === "substraction") {
      this.operator("substraction");
    }

    if (operator === "multiplication") {
      this.operator("multiplication");
    }

    if (operator === "division") {
      this.operator("division");
    }
  }

  inverseNumber(number : number) {
    if (number >= 0) {
      return -number;
    } else {
      return Math.abs(number);
    }
  }

}
