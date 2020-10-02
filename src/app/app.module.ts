import { BrowserModule } from '@angular/platform-browser';
import { ApplicationRef, DoBootstrap, LOCALE_ID, NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { KEYCLOAK_CONFIG } from '../keycloak-config';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { EntryComponent } from './entry/entry.component';
import { FooterComponent } from './footer/footer.component';
import { ShortIdPipe } from './common/short-id.pipe';
import { MaterialModule } from './material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EntryEditorDialogComponent } from './entry-editor-dialog/entry-editor-dialog.component';
import { EntryInfoComponent } from './entry-info/entry-info.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { HeaderComponent } from './header/header.component';
import { ConditionsComponent } from './conditions/conditions.component';
import { TreatmentComponent } from './treatment/treatment.component';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { SubjectRecordEditorDialogComponent } from './subject-record-editor-dialog/subject-record-editor-dialog.component';
import { ConfigComponent } from './config/config.component';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { ThemeComponent } from './theme/theme.component';
import { EntryCardComponent } from './entry-card/entry-card.component';
import { FormCreatorComponent } from './form-creator/form-creator.component';
import { ThemesPageComponent } from './themes-page/themes-page.component';
import { HealthInterceptor } from './interceptors/health.interceptor';
import { HealthErrorComponent } from './interceptors/health-error.component';
import { EntriesLibraryComponent } from './entries/entries-library/entries-library.component';
import { EntriesListDragAndDropComponent } from './entries/entries-list-drag-and-drop/entries-list-drag-and-drop.component';
import { EntriesListSelectComponent } from './entries/entries-list-select/entries-list-select.component';
import { EntriesListComponent } from './entries/entries-list/entries-list.component';
import { CodemirrorModule } from '@ctrl/ngx-codemirror';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { ConditionsPageComponent } from './conditions-page/conditions-page.component';
import { TextOverflowDirective } from './common/text-overflow.directive';
import { ConditionsReadOnlyComponent } from './conditions-read-only/conditions-read-only.component';
import { FormUrlDialogComponent } from './form-url-dialog/form-url-dialog.component';
import { EmailsPageComponent } from './emails-page/emails-page.component';
import { EmailComponent } from './email/email.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { EntryPreviewComponent } from './entry-preview/entry-preview.component';
import { PreferenceComponent } from './preference/preference.component';
import { PreferencesPageComponent } from './preferences-page/preferences-page.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ChartsModule } from 'ng2-charts';
import { SubjectRecordsComponent } from './subject-records/subject-records.component';
import { HeadersPageComponent } from './headers-page/headers-page.component';
import { FootersPageComponent } from './footers-page/footers-page.component';
import { TreatmentsPageComponent } from './treatments-page/treatments-page.component';
import { GeneratedKeyDialogComponent, KeysComponent } from './keys/keys.component';
import { ConfirmDialogComponent } from './common/confirm-dialog/confirm-dialog.component';

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
    EntriesLibraryComponent,
    EntriesListComponent,
    EntriesListDragAndDropComponent,
    EntriesListSelectComponent,
    EntryComponent,
    HeaderComponent,
    TreatmentComponent,
    ConditionsComponent,
    FooterComponent,
    EntryEditorDialogComponent,
    EntryInfoComponent,
    EntryCardComponent,
    ShortIdPipe,
    SubjectRecordEditorDialogComponent,
    ThemeComponent,
    FormCreatorComponent,
    ThemesPageComponent,
    HealthErrorComponent,
    ConditionsPageComponent,
    TextOverflowDirective,
    ConditionsReadOnlyComponent,
    FormUrlDialogComponent,
    EmailsPageComponent,
    EmailComponent,
    ToolbarComponent,
    EntryPreviewComponent,
    PreferenceComponent,
    PreferencesPageComponent,
    DashboardComponent,
    SubjectRecordsComponent,
    HeadersPageComponent,
    FootersPageComponent,
    TreatmentsPageComponent,
    KeysComponent,
    GeneratedKeyDialogComponent,
    ConfirmDialogComponent
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
    CodemirrorModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    StoreModule.forRoot({}, {}),
    EffectsModule.forRoot([]),
    ClipboardModule,
    ChartsModule
  ],
  providers: [
    {
      provide: KeycloakService,
      useValue: keycloakService
    },
    {provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {duration: 3000}},
    // Workaround for https://github.com/angular/angular/issues/15039
    {provide: LOCALE_ID, useClass: DynamicLocaleId, deps: [TranslateService]},
    {provide: HTTP_INTERCEPTORS, useClass: HealthInterceptor, multi: true},
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
