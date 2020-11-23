import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';
import { Observable } from 'rxjs';
import { KeycloakService } from 'keycloak-angular';

@Injectable({
  providedIn: 'root'
})
export class HomeGuardService implements CanActivate {

  constructor(private keycloak: KeycloakService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot)
    : Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.keycloak.isUserInRole('admin')) {
      return this.router.createUrlTree(['/admin/home']);
    } else {
      return this.router.createUrlTree(['/user/me']);
    }
  }
}
