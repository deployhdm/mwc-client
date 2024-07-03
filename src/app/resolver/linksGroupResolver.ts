import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from "@angular/router";
import {LinksService} from "../services/links.service";
import {Observable} from "rxjs";

@Injectable({ providedIn: 'root' })
export class LinksGroupResolver implements Resolve<any> {
  constructor(
    private _service: LinksService
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any>|Promise<any>|any {
    return this._service.getGroupLinksList();
  }
}
