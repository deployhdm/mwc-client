import {Component, HostListener, OnInit} from '@angular/core';
import {CalculatorService} from "../../../services/calculator.service";

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.scss'],
})
export class CalculatorComponent implements OnInit {
  result!:string;
  calculHistory!:string;

  constructor(
    private _calculatorService : CalculatorService
  ) { }

  ngOnInit() {
    this.watchResult();
    this.watchCalculHistory();
  }

  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    this._calculatorService.pressKey(event.key);
  }

  watchResult() {
    this._calculatorService.result.subscribe({
      next:(data) => {
        this.result = data;
      }
    })
  }

  watchCalculHistory() {
    this._calculatorService.calculHistory.subscribe({
      next:(data) => {
        this.calculHistory = data;
      }
    })
  }

  close() {
    this._calculatorService.toogleIsOpen();
  }

  touch(button : number | string) {
    this._calculatorService.touch(button);
  }

}
