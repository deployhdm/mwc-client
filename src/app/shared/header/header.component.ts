import { Component, OnInit } from '@angular/core';
import {MemberService} from "../../services/member.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  isConnected!:boolean;
  isProfilMenu!:boolean;

  constructor(
    private _memberService: MemberService,
    private _router : Router
  ) { }

  ngOnInit() {
    this.checkIfConnected();
  }

  checkIfConnected() {
    this._memberService.isConnectedObservable.subscribe({
      next: (data: boolean) => this.isConnected = data
    })
  }

  toogleProfilMenu() {
    this.isProfilMenu = !this.isProfilMenu;
  }

  disconnect() {
    this.isProfilMenu = false;
    this._memberService.disconnect();
  }

  profil(){
    this.isProfilMenu = false;
    this._router.navigate(['/profil']);
  }
}
