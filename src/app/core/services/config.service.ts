/*-
 * #%L
 * Right Consents, a Universal Consents & Preferences Management Platform.
 * %%
 * Copyright (C) 2020 - 2021 Fair And Smart
 * %%
 * This file is part of Right Consents Community Edition.
 *
 * Right Consents Community Edition is published by FAIR AND SMART under the
 * GNU GENERAL PUBLIC LICENCE Version 3 (GPLv3) and a set of additional terms.
 *
 * For more information, please see the “LICENSE” and “LICENSE.FAIRANDSMART”
 * files, or see https://www.fairandsmart.com/opensource/.
 * #L%
 */
import { Injectable } from '@angular/core';
import { CanLoad, Route, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as _ from 'lodash';
import { TranslateService } from '@ngx-translate/core';
import { AlertService } from './alert.service';
import { ClientConfigDto, getClientConfig } from '@fairandsmart/consent-manager/system';

@Injectable()
export class ConfigService implements CanLoad {

  public config: ClientConfigDto;

  constructor(
    private translateService: TranslateService,
    private alertService: AlertService) {
  }

  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.config == null) {
      return getClientConfig().pipe(
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

  public getDefaultLanguage(): string {
    return this.config?.language;
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
