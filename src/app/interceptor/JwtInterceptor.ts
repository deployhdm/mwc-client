import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable, throwError } from "rxjs";
import {MemberService} from "../services/member.service";
import { Router } from "@angular/router";

@Injectable()
export class JwtInterceptor implements HttpInterceptor{

  constructor(private _memberService : MemberService, private router: Router){}

  intercept(req: HttpRequest<any>, next: HttpHandler) : Observable<HttpEvent<any>>{

    if(this._memberService.chechConnexion() )
    {

      req = req.clone({
        headers : req.headers.set("Content-type", "application/json")
      })

      if(localStorage.getItem('auth_token'))
      {
        req = req.clone({
          headers : req.headers.set("Authorization", `Bearer ${localStorage.getItem('auth_token')}`)
        })
      }

    }

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 403) {
          // Disconnect the user
          this.router.navigate(['home']);
          return new Observable<HttpEvent<any>>();
        }
        // if unauthorized
        if (error.status === 401) {
          // Disconnect the user
          this._memberService.disconnect();
          return new Observable<HttpEvent<any>>();
        }
        return throwError(() => error);
      })
    )
  }
}
