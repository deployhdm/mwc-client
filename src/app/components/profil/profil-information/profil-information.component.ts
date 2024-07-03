import { Component, OnInit } from '@angular/core';
import {MemberService} from "../../../services/member.service";
import {ErrorService} from "../../../services/error.service";
import {AlertService} from "../../../services/alert.service";

@Component({
  selector: 'app-profil-information',
  templateUrl: './profil-information.component.html',
  styleUrls: ['./profil-information.component.scss'],
})
export class ProfilInformationComponent implements OnInit {
  lastname!:string;
  firstname!:string;
  oldPassword!:string;
  newPassword!:string;
  newEmail!:string;

  constructor(
    private _memberService : MemberService,
    private _errorService : ErrorService,
    private _alertService : AlertService
  ) { }

  ngOnInit() {
    this.getMyProfil();
  }


  getMyProfil() {
    this._memberService.getMyProfil().subscribe({
      next: (data) => {
        this.lastname = data.result.lastname;
        this.firstname = data.result.firstname;
      },
      error: (error) => {
        this._errorService.errorHandler(error);
      }
    });
  }

  updateMyName() {
    this._memberService.updateMyName(this.lastname, this.firstname).subscribe({
      next: () => {
        this._alertService.alerte("Profil mis à jour", "Vos informations ont bien été mis à jour");
      },
      error: (error) => {
        this._errorService.errorHandler(error);
      }
    });
  }

  updateMyPassword() {
    this._memberService.updateMyPassword(this.oldPassword, this.newPassword).subscribe({
      next: () => {
        this._alertService.alerte("Mot de passe mis à jour", "Votre nouveau mot de passe a bien été mis à jour");
        this.oldPassword = "";
        this.newPassword = "";
      },
      error: (error) => {
        console.log(error);
        this._errorService.errorHandler(error);
      }
    })
  }

  updateMyMail() {
    this._memberService.updateMyMail(this.newEmail).subscribe({
      next: ()=> {
        this._alertService.alerte("Email mis à jour", "Votre nouvelle email a bien été mis à jour");
        this.oldPassword = "";
      },
      error: (error) => {
        this._errorService.errorHandler(error);
      }
    })
  }

}
