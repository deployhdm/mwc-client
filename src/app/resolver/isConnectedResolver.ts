import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from "@angular/router";
import {Observable} from "rxjs";
import {MemberService} from "../services/member.service";

@Injectable({ providedIn: 'root' })
export class IsConnectedResolver implements Resolve<any> {
  constructor(
    private _member : MemberService,
    private _router : Router
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any>|Promise<any>|any {
    if (localStorage.getItem('auth_token')) {
      this._member.isConnectedObservable.next(true);
      this._member.getMyProfil().subscribe({
        next: (data) => {
          this._member.refreshMyInfo(data.result.email, data.result.firstname, data.result.lastname, data.result.id, data.result.isAdmin)
        },
        error: (error) => {
          this._member.isConnectedObservable.next(false);

          if (state.url !== '/home') {
            this._router.navigate(['connexion']);
          }

          return false;
        }
      })

      return true;
    }

    if (state.url !== '/home') {
      this._router.navigate(['connexion']);
    }

    return false;
  }
}
