import { BrowserModule } from '@angular/platform-browser';
import { ApplicationRef, DoBootstrap, NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { KEYCLOAK_CONFIG } from '../keycloak-config';
import { EntriesComponent } from './entries/entries.component';
import { HttpClientModule } from '@angular/common/http';
import { EntryComponent } from './entry/entry.component';
import { EntryFooterComponent } from './entry-footer/entry-footer.component';
import { ShortIdPipe } from './common/short-id.pipe';
import { MaterialModule } from './material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EntryEditorDialogComponent } from './entry-editor-dialog/entry-editor-dialog.component';

const keycloakService = new KeycloakService();

@NgModule({
  declarations: [
    AppComponent,
    EntriesComponent,
    EntryComponent,
    EntryFooterComponent,
    EntryEditorDialogComponent,
    ShortIdPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    KeycloakAngularModule,
    MaterialModule
  ],
  providers: [
    {
      provide: KeycloakService,
      useValue: keycloakService
    }
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
