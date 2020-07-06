import { BrowserModule } from '@angular/platform-browser';
import { ApplicationRef, DoBootstrap, LOCALE_ID, NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { KEYCLOAK_CONFIG } from '../keycloak-config';
import { EntriesComponent } from './entries/entries.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { EntryComponent } from './entry/entry.component';
import { FooterComponent } from './footer/footer.component';
import { ShortIdPipe } from './common/short-id.pipe';
import { MaterialModule } from './material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EntryEditorDialogComponent } from './entry-editor-dialog/entry-editor-dialog.component';
import { EntryInfoComponent } from './entry-info/entry-info.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { RecordsComponent } from './records/records.component';
import { TokenCreationComponent } from './token-creation/token-creation.component';
import { HeaderComponent } from './header/header.component';
import { ConditionsComponent } from './conditions/conditions.component';
import { TreatmentComponent } from './treatment/treatment.component';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { UserRecordsComponent } from './user-records/user-records.component';
import { UserRecordEditorDialogComponent } from './user-record-editor-dialog/user-record-editor-dialog.component';
import { ConfigComponent } from './config/config.component';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { ThemesComponent } from './themes/themes.component';
import { ThemeComponent } from './theme/theme.component';

const keycloakService = new KeycloakService();

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export class DynamicLocaleId extends String {
  constructor(protected service: TranslateService) {
    super();
  }

  toString() {
    return this.service.currentLang;
  }
}

registerLocaleData(localeFr, 'fr');

@NgModule({
  declarations: [
    AppComponent,
    ConfigComponent,
    EntriesComponent,
    EntryComponent,
    HeaderComponent,
    TreatmentComponent,
    ConditionsComponent,
    FooterComponent,
    EntryEditorDialogComponent,
    EntryInfoComponent,
    EntryCardComponent,
    ShortIdPipe,
    RecordsComponent,
    TokenCreationComponent,
    UserRecordsComponent,
    UserRecordEditorDialogComponent,
    ThemesComponent,
    ThemeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    KeycloakAngularModule,
    MaterialModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    StoreModule.forRoot({}, {}),
    EffectsModule.forRoot([])
  ],
  providers: [
    {
      provide: KeycloakService,
      useValue: keycloakService
    },
    {provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {duration: 3000}},
    // Workaround for https://github.com/angular/angular/issues/15039
    {provide: LOCALE_ID, useClass: DynamicLocaleId, deps: [TranslateService]}
  ]
})
export class AppModule implements DoBootstrap {
  ngDoBootstrap(appRef: ApplicationRef) {
    keycloakService
      .init(KEYCLOAK_CONFIG)
      .then(() => {
        console.log('[ngDoBootstrap] bootstrap app');
        appRef.bootstrap(AppComponent);
      })
      .catch(error => console.error('[ngDoBootstrap] init Keycloak failed', error));
  }
}
