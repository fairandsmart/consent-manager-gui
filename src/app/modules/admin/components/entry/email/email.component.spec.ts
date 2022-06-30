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

import { EmailComponent } from './email.component';
import { ReactiveFormsModule } from '@angular/forms';
import { EntryPreviewComponent } from '../entry-preview/entry-preview.component';
import { CoreTestingModule } from '../../../../../testing/core-testing-module.spec';
import { RouterTestingModule } from '@angular/router/testing';
import { ConfigServiceStubSpec } from '../../../../../testing/config-service-stub.spec';
import { ConfigService } from '../../../../../core/services/config.service';
import { ModelEntryStatus } from '@fairandsmart/consents-ce/models';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RightConsents } from '@fairandsmart/consents-ce';
import { Observable } from 'rxjs';
import { KeycloakService } from 'keycloak-angular';
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;

describe('EmailComponent', () => {
  let component: EmailComponent;
  let fixture: ComponentFixture<EmailComponent>;
  let keycloakServiceSpy: SpyObj<KeycloakService>;
  let configServiceStub: ConfigServiceStubSpec;

  beforeEach(waitForAsync(() => {
    keycloakServiceSpy = createSpyObj('KeycloakService', ['isUserInRole']);
    configServiceStub = new ConfigServiceStubSpec();

    TestBed.configureTestingModule({
      declarations: [ EmailComponent, EntryPreviewComponent ],
      imports: [ CoreTestingModule, RouterTestingModule, ReactiveFormsModule ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {provide: KeycloakService, useValue: keycloakServiceSpy},
        {provide: ConfigService, useValue: configServiceStub}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    RightConsents.init({apiRoot: '', httpClient: () => new Observable()});
    fixture = TestBed.createComponent(EmailComponent);
    component = fixture.componentInstance;
    component.entry = {
      id: 'foo',
      key: 'bar',
      name: 'foo',
      description: 'bar',
      type: 'email',
      versions: [],
      creationDate: 12,
      modificationDate: 42,
      status: ModelEntryStatus.ACTIVE,
      defaultLanguage: 'fr',
      availableLanguages: ['fr'],
      shared: false,
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
