import { Injectable } from '@angular/core';
import { CanLoad, Route, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { SystemResourceService } from '../http/system-resource.service';
import { ClientConfigDto } from '../models/models';
import { map } from 'rxjs/operators';
import * as _ from 'lodash';

@Injectable()
export class ConfigService implements CanLoad {

  public config: ClientConfigDto;

  constructor(private systemResource: SystemResourceService) {
  }

  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.config == null) {
      return this.systemResource.getClientConfig().pipe(
        map(config => {
          this.config = config;
          return this.checkRouteConditions(route);
        })
      );
    } else {
      return this.checkRouteConditions(route);
    }
  }

  private checkRouteConditions(route: Route): boolean {
    if (route.data == null || route.data.config == null) {
      return true;
    }
    const conditions: Partial<ClientConfigDto> = route.data.config;
    return !_.some(conditions, (expectedValue, key) => {
      return !_.isEqual(this.config[key], expectedValue);
    });
  }

}
