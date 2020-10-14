import { NgModule } from '@angular/core';
import { RolesGuardService } from './guards/roles-guard.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HealthInterceptor } from './interceptors/health.interceptor';
import { HealthErrorComponent } from './components/health-error/health-error.component';
import { MaterialModule } from '../material.module';
import { TranslateModule } from '@ngx-translate/core';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { AlertService } from './services/alert.service';
import { ConsentsResourceService } from './http/consents-resource.service';
import { KeysResourceService } from './http/keys-resource.service';
import { ModelsResourceService } from './http/models-resource.service';
import { RecordsResourceService } from './http/records-resource.service';
import { SubjectsResourceService } from './http/subjects-resource.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderNavComponent } from './components/header-nav/header-nav.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    HeaderNavComponent,
    HealthErrorComponent,
    ConfirmDialogComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    TranslateModule
  ],
  exports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    TranslateModule,
    HeaderNavComponent
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: HealthInterceptor, multi: true},
    {provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {duration: 3000}},
    RolesGuardService,
    AlertService,
    ConsentsResourceService,
    KeysResourceService,
    ModelsResourceService,
    RecordsResourceService,
    SubjectsResourceService
  ]
})
export class CoreModule { }
