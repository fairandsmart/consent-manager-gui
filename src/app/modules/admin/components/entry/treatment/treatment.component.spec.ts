import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TreatmentComponent } from './treatment.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ModelsResourceService } from '../../../../../core/http/models-resource.service';
import { EntryInfoComponent } from '../entry-info/entry-info.component';
import { EntryPreviewComponent } from '../entry-preview/entry-preview.component';
import { CoreTestingModule } from '../../../../../testing/core-testing-module.spec';
import { RouterTestingModule } from '@angular/router/testing';
import { AlertService } from '../../../../../core/services/alert.service';
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;
import { KeycloakService } from 'keycloak-angular';

describe('TreatmentComponent', () => {
  let component: TreatmentComponent;
  let fixture: ComponentFixture<TreatmentComponent>;
  let modelsResourceServiceSpy: SpyObj<ModelsResourceService>;
  let keycloakServiceSpy: SpyObj<KeycloakService>;
  let alertServiceSpy: SpyObj<AlertService>;

  beforeEach(waitForAsync(() => {
    modelsResourceServiceSpy =  createSpyObj<ModelsResourceService>('ModelsResourceService', ['listEntries']);
    alertServiceSpy =  createSpyObj('AlertService', ['error']);
    keycloakServiceSpy =  createSpyObj<KeycloakService>('KeycloakService', ['getUsername']);

    TestBed.configureTestingModule({
      declarations: [ TreatmentComponent, EntryInfoComponent, EntryPreviewComponent ],
      imports: [ CoreTestingModule, RouterTestingModule, ReactiveFormsModule ],
      providers: [
        {provide: ModelsResourceService, useValue: modelsResourceServiceSpy},
        {provide: KeycloakService, useValue: keycloakServiceSpy},
        {provide: AlertService, useValue: alertServiceSpy}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TreatmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
