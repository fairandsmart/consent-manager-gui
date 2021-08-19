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
import { ModuleWithProviders, NgModule } from '@angular/core';
import { RolesGuardService } from './guards/roles-guard.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HealthInterceptor } from './interceptors/health.interceptor';
import { HealthErrorComponent } from './components/health-error/health-error.component';
import { MaterialModule } from '../material.module';
import { TranslateModule } from '@ngx-translate/core';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { AlertService } from './services/alert.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderNavComponent } from './components/header-nav/header-nav.component';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RoutingErrorPageComponent } from './pages/routing-error-page/routing-error-page.component';
import { ConfigService } from './services/config.service';
import { AceEditorComponent } from './components/ace-editor/ace-editor.component';
import { AceModule } from 'ngx-ace-wrapper';

@NgModule({
  declarations: [
    HeaderNavComponent,
    HealthErrorComponent,
    ConfirmDialogComponent,
    RoutingErrorPageComponent,
    AceEditorComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    TranslateModule,
    FlexLayoutModule,
    AceModule
  ],
  exports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    TranslateModule,
    FlexLayoutModule,
    HeaderNavComponent,
    AceEditorComponent
  ]
})
export class CoreModule {
  static forRoot(): ModuleWithProviders<CoreModule> {
    return {
      ngModule: CoreModule,
      providers: [
        {provide: HTTP_INTERCEPTORS, useClass: HealthInterceptor, multi: true},
        {provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {duration: 3000}},
        RolesGuardService,
        AlertService,
        ConfigService
      ]
    };
  }
}
