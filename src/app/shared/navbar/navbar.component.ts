import { Component, OnInit } from '@angular/core';
import {MemberService} from "../../services/member.service";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  burgerMenu!:boolean;
  isConnected!:boolean;

  constructor(
    private _memberService: MemberService
  ) {}

  ngOnInit() {
    this.checkIfConnected();
  }

  checkIfConnected() {
    this._memberService.isConnectedObservable.subscribe({
      next: (data: boolean) => this.isConnected = data
    })
  }

  toggleBurgerMenu() {
    this.burgerMenu = !this.burgerMenu;
  }

}
