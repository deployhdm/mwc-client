import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {ResRelation} from "../models/relationModel";
import {ResInvitation} from "../models/invitationModel";

@Injectable({
  providedIn: 'root'
})
export class RelationService {
  api:string = environment.api;

  constructor(
    private _client : HttpClient
  ) { }

  sendInvitation(email:string) : Observable<any> {
    return this._client.post<any>(this.api + "friends/invitation", {
      email
    })
  }

  getAllRelation() : Observable<ResRelation> {
    return this._client.get<ResRelation>(this.api + "friends");
  }

  getAllInvitation() : Observable<ResInvitation> {
    return this._client.get<ResInvitation>(this.api + "friends/invitation");
  }

  acceptInvitation(id:number) : Observable<any> {
    return this._client.put<any>(this.api + "friends/invitation/" + id, {});
  }

  refuseInvitation(id:number) : Observable<any> {
    return this._client.post<any>(this.api + "friends/invitation/" + id, {});
  }

  deleteRelation(id: number) : Observable<any> {
    return this._client.delete<any>(this.api + "friends/" + id);
  }

  deleteInvitation(id: number) : Observable<any> {
    return this._client.delete<any>(this.api + "friends/invitation/" + id)
  }
}
