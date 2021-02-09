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

import { OperatorSubjectPageComponent } from './operator-subject-page.component';
import { RouterTestingModule } from '@angular/router/testing';
import { CoreTestingModule } from '../../../../../testing/core-testing-module.spec';
import { HttpClientModule } from '@angular/common/http';
import { ConsentsResourceService } from '../../../../../core/http/consents-resource.service';
import { SubjectsResourceService } from '../../../../../core/http/subjects-resource.service';
import { ActivatedRouteStubSpec } from '../../../../../testing/activated-route-stub.spec';
import { ActivatedRoute } from '@angular/router';
import { EMPTY, of } from 'rxjs';
import { ConfigServiceStubSpec } from '../../../../../testing/config-service-stub.spec';
import { ConfigService } from '../../../../../core/services/config.service';
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;

describe('OperatorSubjectPageComponent', () => {
  let component: OperatorSubjectPageComponent;
  let fixture: ComponentFixture<OperatorSubjectPageComponent>;
  let consentsResourceServiceSpy: SpyObj<ConsentsResourceService>;
  let subjectsResourceServiceSpy: SpyObj<SubjectsResourceService>;
  let activatedRouteStub: ActivatedRouteStubSpec;
  let configServiceStub: ConfigServiceStubSpec;

  beforeEach(waitForAsync(() => {
    consentsResourceServiceSpy = createSpyObj<ConsentsResourceService>('ConsentsResourceService', ['generateToken', 'postConsent']);
    subjectsResourceServiceSpy = createSpyObj<SubjectsResourceService>('SubjectsResourceService', ['getSubject', 'listSubjectRecords', 'updateSubject', 'createSubject']);
    activatedRouteStub = new ActivatedRouteStubSpec({
      params: {
        subject: 'foobar'
      }
    });
    configServiceStub = new ConfigServiceStubSpec();

    TestBed.configureTestingModule({
      declarations: [OperatorSubjectPageComponent],
      imports: [CoreTestingModule, RouterTestingModule, HttpClientModule],
      providers: [
        {provide: ConsentsResourceService, useValue: consentsResourceServiceSpy},
        {provide: SubjectsResourceService, useValue: subjectsResourceServiceSpy},
        {provide: ActivatedRoute, useValue: activatedRouteStub},
        {provide: ConfigService, useValue: configServiceStub}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    consentsResourceServiceSpy.generateToken.and.returnValue(of('foobar'));
    consentsResourceServiceSpy.postConsent.and.returnValue(of('foobar'));
    subjectsResourceServiceSpy.getSubject.and.returnValue(EMPTY);

    fixture = TestBed.createComponent(OperatorSubjectPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
