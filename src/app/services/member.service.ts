import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {ActivatedRoute, Router} from "@angular/router";
import {ResMember} from "../models/memberModel";

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  api:string = environment.api;
  isConnected : boolean = false; // Must be false or you won't have token !
  isConnectedObservable : BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.isConnected);

  email!:string;
  firstname!:string;
  lastname!:string;
  id!:number;
  isAdmin!:boolean;

  constructor(
    private _client : HttpClient,
    private _router : Router,
    private ar : ActivatedRoute
  ) { }

  chechConnexion() {
    return this.isConnectedObservable;
  }

  inscription (email: string, password: string, firstname: string, lastname: string) {
    const data = {email, password, firstname, lastname};
    return this._client.post<any>(this.api + "auth/register", data);
  }

  connexion (email: string, password: string) {
    const data = {email, password};
    return this._client.post<any>(this.api + "auth/login", data);
  }

  connexionDone (email:string, firstname:string, lastname:string, id:number, isAdmin: boolean, token:string) {
    localStorage.setItem('auth_token', token);
    this.isConnected=true;
    this.isConnectedObservable.next(true);
    this._router.navigate(['home']);
  }

  refreshMyInfo(email:string, firstname:string, lastname:string, id:number, isAdmin: boolean) {
    this.email=email;
    this.firstname=firstname;
    this.lastname=lastname;
    this.id=id;
    this.isAdmin=isAdmin;
  }

  sendResetPasswordEmail(email:string): Observable<any> {
    return this._client.post<any>(this.api + "auth/forgot-password", {
      email: email
    })
  }

  getMemberId(token:string): Observable<any> {
    return this._client.get<any>(this.api + "auth/reset-password/" + token)
  }

  resetPassword(token:string, newPassword: string, memberId: number): Observable<any> {
    return this._client.post<any>(this.api + "auth/reset-password/" + token, {
      newPassword: newPassword,
      memberId: memberId
    })
  }

  getMemberIdAfterRegisterInvit(token: string): Observable<any> {
    return this._client.get<any>(this.api + "auth/invite-register/" + token)
  }

  createInvitedMember(token: string, password: string, firstname: string, lastname: string): Observable<any> {
    return this._client.post<any>(this.api + "auth/invite-register/" + token, {
      firstname: firstname,
      lastname: lastname,
      password: password
    });
  }

  disconnect() {
    localStorage.removeItem('auth_token');
    this.isConnected=false;
    this.isConnectedObservable.next(false);
    this._router.navigate(['home'], {relativeTo: this.ar, queryParamsHandling: 'merge'});
    location.reload();
  }

  getMyProfil() :Observable<ResMember>{
    return this._client.get<ResMember>(this.api + "member");
  }

  updateMyName(lastname: string, firstname: string) : Observable<any> {
    this.firstname = firstname;
    this.lastname = lastname;

    return this._client.put<any>(this.api + "member/" + this.id, {
      firstname,
      lastname
    })
  }

  updateMyPassword(oldPassword : string, newPassword : string) : Observable<any> {
    return this._client.post<any>(this.api + "member/" + this.id, {
      oldPassword,
      newPassword
    })
  }

  updateMyMail(newMail : string) : Observable<any> {
    return this._client.put<any>(this.api + "member/email/" + this.id, {
      newEmail : newMail
    })
  }
}
