import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRecordsComponent } from './user-records.component';
import { RouterTestingModule } from '@angular/router/testing';
import createSpyObj = jasmine.createSpyObj;
import SpyObj = jasmine.SpyObj;
import { EMPTY } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ModelsResourceService } from '../models-resource.service';
import { KeycloakService } from 'keycloak-angular';
import { TranslateModule } from '@ngx-translate/core';
import { RecordsResourceService } from '../records-resource.service';

describe('UserRecordsComponent', () => {
  let component: UserRecordsComponent;
  let fixture: ComponentFixture<UserRecordsComponent>;
  let recordsResourceServiceSpy: SpyObj<RecordsResourceService>;
  let modelsResourceServiceSpy: SpyObj<ModelsResourceService>;
  let keycloakServiceSpy: SpyObj<KeycloakService>;

  beforeEach(async(() => {
    recordsResourceServiceSpy =  createSpyObj<RecordsResourceService>('RecordsResourceService', ['listRecords', 'listUserRecords']);
    modelsResourceServiceSpy =  createSpyObj<ModelsResourceService>('ModelsResourceService', ['listEntries']);
    keycloakServiceSpy = createSpyObj('KeycloakService', ['isUserInRole']);

    TestBed.configureTestingModule({
      declarations: [ UserRecordsComponent ],
      imports: [RouterTestingModule, ReactiveFormsModule, MaterialModule, NoopAnimationsModule, TranslateModule.forRoot()],
      providers: [
        {provide: RecordsResourceService, useValue: recordsResourceServiceSpy},
        {provide: ModelsResourceService, useValue: modelsResourceServiceSpy},
        {provide: KeycloakService, useValue: keycloakServiceSpy}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    recordsResourceServiceSpy.listRecords.and.returnValue(EMPTY);

    fixture = TestBed.createComponent(UserRecordsComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
