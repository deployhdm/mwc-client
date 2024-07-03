import { Component, OnInit } from '@angular/core';
import {MemberService} from "../../services/member.service";
import {ErrorService} from "../../services/error.service";
import { ActivatedRoute } from '@angular/router';
import { error } from 'console';

@Component({
  selector: 'app-inscription',
  templateUrl: './inscription.page.html',
  styleUrls: ['./inscription.page.scss'],
})
export class InscriptionPage implements OnInit {
  isRegister!:boolean;
  email!:string;
  password!:string;
  firstname!:string;
  lastname!:string;
  token!: string | null;

  constructor(
    private _memberService : MemberService,
    private _errorService : ErrorService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.isRegister = false;
    this.route.params.subscribe(params => {
      if (params['token']){
        let token = params['token']
        this.token = encodeURIComponent(token);
        this.getMemberIdAfterRegisterInvit();
      }
    })

  }

  makeInscription() {
    this._memberService.inscription(this.email, this.password, this.firstname, this.lastname).subscribe({
      next: (result) => {
        this.isRegister = true;
      },
      error: (error) => {
        this._errorService.errorHandler(error);
      }
    })
  }

  checkIfEmpty() {
    return !this.email || !this.password || !this.firstname || !this.lastname;
  }

  getMemberIdAfterRegisterInvit(): void {
    if (this.token){
      this._memberService.getMemberIdAfterRegisterInvit(this.token).subscribe({
        next: (data) => {
          this.email = data.email
          if (!this.email){
            this.token = null;
          }
        },
        error: (error) => {
          this.token = null;
          this._errorService.errorHandler(error);
        }
      })
    }
  }

  createInvitedMember() {
    if (this.token){
      this._memberService.createInvitedMember(this.token, this.password, this.firstname, this.lastname).subscribe({
        next: (data) => {
          this.isRegister = true;
        },
        error: (error) => {
          this._errorService.errorHandler(error);
        }
      })
    }
  }

  handleRegisterClick() {
    if (this.token) {
      this.createInvitedMember()
    } else {
      this.makeInscription()
    }
  }
}
