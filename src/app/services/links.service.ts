import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable, of, Subject, tap} from "rxjs";
import {LinksGroups} from "../models/groupLinksModel";
import {environment} from "../../environments/environment";
import {Link, Links} from "../models/linksModel";
import { Collaborators, PermissionLevel } from '../models/collaboratorModel';

@Injectable({
  providedIn: 'root'
})
export class LinksService {
  api:string = environment.api;
  private linksUpdated = new Subject<any>();

  constructor(
    private _client : HttpClient
  ) { }

  getLinksUpdateEmitter() {
    return this.linksUpdated.asObservable();
  }

  createGroupLinks(name:string) : Observable<any> {
    return this._client.post<any>(this.api + "linksgroup", {
      "name" : name,
      "description" : ""
    }).pipe(tap(updatedLinks => {
      this.linksUpdated.next(updatedLinks);
    }))
  }

  createLink(name:string, link: string, linksGroupId: number) : Observable<any> {
    return  this._client.post<any>(this.api + "links", {
      "name" : name,
      "link": link,
      "linksGroupId": linksGroupId
    }).pipe(tap(updatedLinks => {
      this.linksUpdated.next(updatedLinks);
    }))
  }

  getGroupLinksList () : Observable<LinksGroups> {
    return this._client.get<LinksGroups>(this.api + "linksgroup");
  }

  getLinksList () : Observable<Links> {
    return this._client.get<Links>(this.api + "links");
  }

  updateLink(id:number, name:string, link: string) : Observable<any> {
    return this._client.put<any>(this.api + "links/" + id, {
      "name": name,
      "link": link
    }).pipe(tap(updatedLinks => {
        this.linksUpdated.next(updatedLinks);
    }))
  }

  updateGroupLinksName(id:number, name:string) : Observable<any> {
    return this._client.put<any>(this.api + "linksgroup/" + id, {
      "name": name,
      "description": ""
    }).pipe(tap(updatedLinks => {
      this.linksUpdated.next(updatedLinks);
    }))
  }

  deleteLink(id:number) : Observable<any> {
    return this._client.delete<any>(this.api + "links/" + id).pipe(tap(updatedLinks => {
      this.linksUpdated.next(updatedLinks);
    }))
  }

  deleteGroupLinks(id:number) : Observable<any> {
    return this._client.delete<any>(this.api + "linksgroup/" + id).pipe(tap(updatedLinks => {
      this.linksUpdated.next(updatedLinks);
    }))
  }

  filterHotLinkList(linkList : Link[]) : Observable<any> {
    linkList.sort((a : any, b : any) => b.clickedCounter - a.clickedCounter);
    linkList = linkList.slice(0, 10);
    return of(linkList);
  }

  clickOnLink(id : number) : Observable<any> {
    return this._client.post<any>(this.api + "links/" + id, {}).pipe(tap(updatedLinks => {
      this.linksUpdated.next(updatedLinks);
    }))
  }

  shareGroupLinks(email: string, permissionLevel: PermissionLevel, id: number): Observable<any> {
    return this._client.post<any>(this.api +  "linksgroup/" + id + "/share", {
      email: email,
      permissionLevel: permissionLevel
    })
  }

  getCollaborators(id: number): Observable<any>{
    return this._client.get<Collaborators>(this.api + "linksgroup/" + id + "/share");
  }

  cancelInvitation(email: string, id: number): Observable<any> {
    const params = new HttpParams()
      .set('email', email)
    return this._client.delete<any>(this.api + "linksgroup/" + id + "/share", { params })
  }
}
