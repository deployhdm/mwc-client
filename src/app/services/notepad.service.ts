import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class NotepadService {
  api:string = environment.api;

  constructor(
    private _client : HttpClient
  ) { }

  getNotepad () : Observable<any> {
    return this._client.get<any>(this.api + "notepad");
  }

  updateText (text: string) : Observable<any> {
    return this._client.post<any>(this.api + "notepad", {
      content : text
    });
  }
}
