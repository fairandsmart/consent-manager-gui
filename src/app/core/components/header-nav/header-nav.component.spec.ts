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

import { HeaderNavComponent } from './header-nav.component';
import { KeycloakService } from 'keycloak-angular';
import { CoreTestingModule } from '../../../testing/core-testing-module.spec';
import { RouterTestingModule } from '@angular/router/testing';
import { SubjectsResourceService } from '../../http/subjects-resource.service';
import { EMPTY, of } from 'rxjs';
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;
import { TranslateService } from '@ngx-translate/core';
import { CoreService } from '../../services/core.service';

describe('HeaderNavComponent', () => {
  let component: HeaderNavComponent;
  let fixture: ComponentFixture<HeaderNavComponent>;
  let keycloakServiceSpy: SpyObj<KeycloakService>;
  let subjectsResourceServiceSpy: SpyObj<SubjectsResourceService>;
  let coreServiceSpy: SpyObj<CoreService>;

  beforeEach(waitForAsync(() => {
    keycloakServiceSpy = createSpyObj<KeycloakService>('KeycloakService', ['getUsername', 'isUserInRole']);
    subjectsResourceServiceSpy = createSpyObj<SubjectsResourceService>('SubjectsResourceService', ['listSubjects']);
    coreServiceSpy = createSpyObj<CoreService>('CoreService', ['checkBasicInfo']);

    TestBed.configureTestingModule({
      declarations: [ HeaderNavComponent ],
      imports: [ CoreTestingModule, RouterTestingModule ],
      providers: [
        {provide: KeycloakService, useValue: keycloakServiceSpy},
        {provide: SubjectsResourceService, useValue: subjectsResourceServiceSpy},
        {provide: CoreService, useValue: coreServiceSpy},
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    keycloakServiceSpy.getUsername.and.returnValue('FOO BAR');
    keycloakServiceSpy.isUserInRole.and.returnValue(true);
    subjectsResourceServiceSpy.listSubjects.and.returnValue(of([]));

    fixture = TestBed.createComponent(HeaderNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
