import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EntriesPageComponent } from './entries-page.component';
import { KeycloakService } from 'keycloak-angular';
import { ModelsResourceService } from '../../../../core/http/models-resource.service';
import { SubjectsResourceService } from '../../../../core/http/subjects-resource.service';
import { EMPTY } from 'rxjs';
import { CoreTestingModule } from '../../../../testing/core-testing-module.spec';
import { AlertService } from '../../../../core/services/alert.service';
import { ConfigService } from '../../../../core/services/config.service';
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;

describe('EntriesPageComponent', () => {
  let component: EntriesPageComponent;
  let fixture: ComponentFixture<EntriesPageComponent>;
  let keycloakServiceSpy: SpyObj<KeycloakService>;
  let modelsResourceServiceSpy: SpyObj<ModelsResourceService>;
  let subjectsResourceServiceSpy: SpyObj<SubjectsResourceService>;
  let alertServiceSpy: SpyObj<AlertService>;
  let configServiceSpy: SpyObj<ConfigService>;

  beforeEach(waitForAsync(() => {
    keycloakServiceSpy = createSpyObj<KeycloakService>('KeycloakService', ['getUsername']);
    modelsResourceServiceSpy =  createSpyObj<ModelsResourceService>('ModelsResourceService', ['listEntries']);
    subjectsResourceServiceSpy =  createSpyObj<SubjectsResourceService>('SubjectsResourceService', ['listCustomerRecords']);
    alertServiceSpy =  createSpyObj<AlertService>('AlertService', ['error']);
    configServiceSpy =  createSpyObj<ConfigService>('ConfigService', ['canLoad']);

    TestBed.configureTestingModule({
      declarations: [ EntriesPageComponent ],
      imports: [ CoreTestingModule ],
      providers: [
        {provide: KeycloakService, useValue: keycloakServiceSpy},
        {provide: ModelsResourceService, useValue: modelsResourceServiceSpy},
        {provide: SubjectsResourceService, useValue: subjectsResourceServiceSpy},
        {provide: AlertService, useValue: alertServiceSpy},
        {provide: ConfigService, useValue: configServiceSpy},
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    keycloakServiceSpy.getUsername.and.returnValue('FOO BAR');
    modelsResourceServiceSpy.listEntries.and.returnValue(EMPTY);
    subjectsResourceServiceSpy.listCustomerRecords.and.returnValue(EMPTY);
    (configServiceSpy as any).config = {userPageElements: []};

    fixture = TestBed.createComponent(EntriesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
