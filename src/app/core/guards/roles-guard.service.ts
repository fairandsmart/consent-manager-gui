import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { KeycloakService } from 'keycloak-angular';

@Injectable()
export class RolesGuardService implements CanActivate {

  constructor(private keycloak: KeycloakService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot)
    : Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if ((route.data.roles as string[]).some(r => this.keycloak.isUserInRole(r))) {
      return true;
    } else {
      return this.router.createUrlTree(['']);
    }
  }

}
