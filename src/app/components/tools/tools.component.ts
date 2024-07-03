import { Component, OnInit } from '@angular/core';
import {CalculatorService} from "../../services/calculator.service";
import {DemineurService} from "../../services/demineur.service";

@Component({
  selector: 'app-tools',
  templateUrl: './tools.component.html',
  styleUrls: ['./tools.component.scss'],
})
export class ToolsComponent implements OnInit {
  calculator!:boolean;
  demineur!:boolean;

  constructor(
    private _calculatorService : CalculatorService,
    private _demineurService :DemineurService
  ) { }

  ngOnInit() {
    this.getDisplay();
  }

  getDisplay() {
    this._calculatorService.isOpenObservable.subscribe({
      next:(data) => {
        this.calculator = data;
      }
    })

    this._demineurService.isOpenDemineur.subscribe({
      next:(data) => {
        this.demineur = data;
      }
    })
  }

  calculatorToogle() {
    this._calculatorService.toogleIsOpen();
  }

  demineurToogle() {
    this._demineurService.toogleIsOpen();
  }
}
