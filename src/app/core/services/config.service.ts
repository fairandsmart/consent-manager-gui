import { Injectable } from '@angular/core';
import { CanLoad, Route, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { SystemResourceService } from '../http/system-resource.service';
import { ClientConfigDto } from '../models/models';
import { map } from 'rxjs/operators';
import * as _ from 'lodash';
import {TranslateService} from '@ngx-translate/core';
import {AlertService} from './alert.service';

@Injectable()
export class ConfigService implements CanLoad {

  public config: ClientConfigDto;

  constructor(
    private systemResource: SystemResourceService,
    private translateService: TranslateService,
    private alertService: AlertService) {
  }

  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.config == null) {
      return this.systemResource.getClientConfig().pipe(
        map(config => {
          this.config = config;
          if (!this.config.language) {
            this.alertService.error('ALERT.BAD_VERSION', {});
            return false;
          }
          this.translateService.setDefaultLang(this.config.language);
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
