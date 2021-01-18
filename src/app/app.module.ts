import { BrowserModule } from '@angular/platform-browser';
import { ApplicationRef, DoBootstrap, LOCALE_ID, NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { KEYCLOAK_CONFIG } from '../keycloak-config';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { CoreModule } from './core/core.module';
import {environment} from '../environments/environment';

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
  ngDoBootstrap(appRef: ApplicationRef): void {
    keycloakService
      .init(KEYCLOAK_CONFIG)
      .then(() => {
        appRef.bootstrap(AppComponent);
      })
      .catch(error => console.error('[ngDoBootstrap] init Keycloak failed', error));
  }
}
