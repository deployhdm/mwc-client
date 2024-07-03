import { Component, OnInit } from '@angular/core';
import {MemberService} from "../../services/member.service";
import {ErrorService} from "../../services/error.service";

@Component({
  selector: 'app-connexion',
  templateUrl: './connexion.page.html',
  styleUrls: ['./connexion.page.scss'],
})
export class ConnexionPage implements OnInit {
  email!:string;
  password!:string;

  constructor(
    private _memberService : MemberService,
    private _errorService : ErrorService
  ) {}

  ngOnInit() {
  }

  makeConnexion() {
    this._memberService.connexion(this.email, this.password).subscribe({
      next : (data : any) => {
        this._memberService.connexionDone(data.email, data.firstname, data.lastname, data.id,
        data.isAdmin, data.token);
      },
      error : (error : any) => {
        this._errorService.errorHandler(error);
      }
      })
  }

  checkIfEmpty() {
    return !this.email || !this.password;
  }

}
