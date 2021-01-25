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
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UserPageComponent } from './user-page.component';
import { CoreTestingModule } from '../../../../testing/core-testing-module.spec';
import { RouterTestingModule } from '@angular/router/testing';
import { KeycloakService } from 'keycloak-angular';
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;
import { SubjectsResourceService } from '../../../../core/http/subjects-resource.service';
import { EMPTY } from 'rxjs';
import { CoreService } from '../../../../core/services/core.service';

describe('UserPageComponent', () => {
  let component: UserPageComponent;
  let fixture: ComponentFixture<UserPageComponent>;
  let keycloakServiceSpy: SpyObj<KeycloakService>;
  let subjectsResourceServiceSpy: SpyObj<SubjectsResourceService>;
  let coreServiceSpy: SpyObj<CoreService>;

  beforeEach(waitForAsync(() => {
    keycloakServiceSpy = createSpyObj<KeycloakService>('KeycloakService', ['getUsername', 'isUserInRole']);
    subjectsResourceServiceSpy = createSpyObj<SubjectsResourceService>('SubjectsResourceService', ['listSubjects']);
    coreServiceSpy = createSpyObj<CoreService>('CoreService', ['checkBasicInfo']);

    TestBed.configureTestingModule({
      declarations: [ UserPageComponent ],
      imports: [ CoreTestingModule, RouterTestingModule ],
      providers: [
        {provide: KeycloakService, useValue: keycloakServiceSpy},
        {provide: SubjectsResourceService, useValue: subjectsResourceServiceSpy},
        {provide: CoreService, useValue: coreServiceSpy}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    keycloakServiceSpy.getUsername.and.returnValue('FOO BAR');
    keycloakServiceSpy.isUserInRole.and.returnValue(true);
    subjectsResourceServiceSpy.listSubjects.and.returnValue(EMPTY);

    fixture = TestBed.createComponent(UserPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
