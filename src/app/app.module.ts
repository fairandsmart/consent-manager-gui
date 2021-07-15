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
import { BrowserModule } from '@angular/platform-browser';
import { ApplicationRef, DoBootstrap, Injector, LOCALE_ID, NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { KEYCLOAK_CONFIG } from '../keycloak-config';
import {
  HttpClient,
  HttpClientModule,
  HttpEventType,
  HttpHeaders,
  HttpParams,
  HttpRequest, HttpResponse
} from '@angular/common/http';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { CoreModule } from './core/core.module';
import {environment} from '../environments/environment';
import { ConfigService } from './core/services/config.service';
import { RcHttpClient, RcHttpClientConfig, RightConsents } from '@fairandsmart/consent-manager';
import { filter, map } from 'rxjs/operators';

const keycloakService = new KeycloakService();

export function createTranslateLoader(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export class DynamicLocaleId extends String {
  constructor(protected translate: TranslateService) {
    super();
  }

  toString(): string {
    return this.translate.currentLang;
  }
}

registerLocaleData(localeFr, environment.customization?.defaultLanguage || 'fr');

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    CoreModule.forRoot(),
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    KeycloakAngularModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),

  ],
  providers: [
    {
      provide: KeycloakService,
      useValue: keycloakService
    },
    // Workaround for https://github.com/angular/angular/issues/15039
    {provide: LOCALE_ID, useClass: DynamicLocaleId, deps: [TranslateService]},
  ]
})
export class AppModule implements DoBootstrap {

  constructor(private injector: Injector) {}

  ngDoBootstrap(appRef: ApplicationRef): void {
    const configService = this.injector.get(ConfigService);
    keycloakService
      .init(KEYCLOAK_CONFIG)
      .then(() => {
        RightConsents.init({
          apiRoot: environment.managerUrl,
          httpClient: this.createHttpClient()
        });
        return configService.init();
      })
      .then(() => {
        appRef.bootstrap(AppComponent);
      })
      .catch(error => console.error('[ngDoBootstrap] init Keycloak failed', error));
  }

  createHttpClient(): RcHttpClient {
    const http = this.injector.get(HttpClient);
    return <T>(config: RcHttpClientConfig) => {
      let req: HttpRequest<T>;
      if (config.method === 'POST' || config.method === 'PUT') {
        req = new HttpRequest<T>(config.method, config.url, config.body, {
          responseType: config.responseType,
          headers: new HttpHeaders(config.headers),
          params: new HttpParams({fromObject: config.params}),
        });
      } else if (config.method === 'DELETE' || config.method === 'GET') {
        req = new HttpRequest<T>(config.method, config.url, {
          responseType: config.responseType as any,
          headers: new HttpHeaders(config.headers),
          params: new HttpParams({fromObject: config.params}),
        });
      }
      return http.request<T>(req).pipe(filter((ev) => ev.type === HttpEventType.Response), map((res: HttpResponse<T>) => {
        if (config.options?.data?.extractResponseHeaders === true) {
          return {
            body: res.body,
            headers: res.headers
          } as any;
        }
        return res.body;
      }));
    };
  }
}
