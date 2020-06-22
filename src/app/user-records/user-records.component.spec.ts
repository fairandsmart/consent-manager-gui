import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRecordsComponent } from './user-records.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ConsentsResourceService } from '../consents-resource.service';
import createSpyObj = jasmine.createSpyObj;
import SpyObj = jasmine.SpyObj;
import { EMPTY } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ModelsResourceService } from '../models-resource.service';
import { KeycloakService } from 'keycloak-angular';

describe('UserRecordsComponent', () => {
  let component: UserRecordsComponent;
  let fixture: ComponentFixture<UserRecordsComponent>;
  let consentsResourceServiceSpy: SpyObj<ConsentsResourceService>;
  let modelsResourceServiceSpy: SpyObj<ModelsResourceService>;
  let keycloakServiceSpy: SpyObj<KeycloakService>;

  beforeEach(async(() => {
    consentsResourceServiceSpy =  createSpyObj<ConsentsResourceService>('ConsentsResourceService', ['listRecords', 'listUserRecords']);
    modelsResourceServiceSpy =  createSpyObj<ModelsResourceService>('ModelsResourceService', ['listEntries']);
    keycloakServiceSpy = createSpyObj('KeycloakService', ['isUserInRole']);

    TestBed.configureTestingModule({
      declarations: [ UserRecordsComponent ],
      imports: [RouterTestingModule, ReactiveFormsModule, MaterialModule, NoopAnimationsModule],
      providers: [
        {provide: ConsentsResourceService, useValue: consentsResourceServiceSpy},
        {provide: ModelsResourceService, useValue: modelsResourceServiceSpy},
        {provide: KeycloakService, useValue: keycloakServiceSpy}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    consentsResourceServiceSpy.listRecords.and.returnValue(EMPTY);

    fixture = TestBed.createComponent(UserRecordsComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
