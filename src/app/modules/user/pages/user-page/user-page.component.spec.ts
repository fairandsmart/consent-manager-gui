import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UserPageComponent } from './user-page.component';
import { CoreTestingModule } from '../../../../testing/core-testing-module.spec';
import { RouterTestingModule } from '@angular/router/testing';
import { KeycloakService } from 'keycloak-angular';
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;
import { SubjectsResourceService } from '../../../../core/http/subjects-resource.service';
import { EMPTY } from 'rxjs';

describe('UserPageComponent', () => {
  let component: UserPageComponent;
  let fixture: ComponentFixture<UserPageComponent>;
  let keycloakServiceSpy: SpyObj<KeycloakService>;
  let subjectsResourceServiceSpy: SpyObj<SubjectsResourceService>;

  beforeEach(waitForAsync(() => {
    keycloakServiceSpy = createSpyObj<KeycloakService>('KeycloakService', ['getUsername']);
    subjectsResourceServiceSpy = createSpyObj<SubjectsResourceService>('SubjectsResourceService', ['listSubjects']);

    TestBed.configureTestingModule({
      declarations: [ UserPageComponent ],
      imports: [ CoreTestingModule, RouterTestingModule ],
      providers: [
        {provide: KeycloakService, useValue: keycloakServiceSpy},
        {provide: SubjectsResourceService, useValue: subjectsResourceServiceSpy}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    keycloakServiceSpy.getUsername.and.returnValue('FOO BAR');
    subjectsResourceServiceSpy.listSubjects.and.returnValue(EMPTY);

    fixture = TestBed.createComponent(UserPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
