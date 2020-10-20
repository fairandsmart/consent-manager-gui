import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EntriesPageComponent } from './entries-page.component';
import { KeycloakService } from 'keycloak-angular';
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;
import { ModelsResourceService } from '../../../../core/http/models-resource.service';
import { SubjectsResourceService } from '../../../../core/http/subjects-resource.service';
import { EMPTY } from 'rxjs';

describe('EntriesPageComponent', () => {
  let component: EntriesPageComponent;
  let fixture: ComponentFixture<EntriesPageComponent>;
  let keycloakServiceSpy: SpyObj<KeycloakService>;
  let modelsResourceServiceSpy: SpyObj<ModelsResourceService>;
  let subjectsResourceServiceSpy: SpyObj<SubjectsResourceService>;

  beforeEach(waitForAsync(() => {
    keycloakServiceSpy = createSpyObj<KeycloakService>('KeycloakService', ['getUsername']);
    modelsResourceServiceSpy =  createSpyObj('ModelsResourceService', ['listEntriesByKeys']);
    subjectsResourceServiceSpy =  createSpyObj('SubjectsResourceService', ['listCustomerRecords']);

    TestBed.configureTestingModule({
      declarations: [ EntriesPageComponent ],
      providers: [
        {provide: KeycloakService, useValue: keycloakServiceSpy},
        {provide: ModelsResourceService, useValue: modelsResourceServiceSpy},
        {provide: SubjectsResourceService, useValue: subjectsResourceServiceSpy}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    keycloakServiceSpy.getUsername.and.returnValue('FOO BAR');
    modelsResourceServiceSpy.listEntriesByKeys.and.returnValue(EMPTY);
    subjectsResourceServiceSpy.listCustomerRecords.and.returnValue(EMPTY);

    fixture = TestBed.createComponent(EntriesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
