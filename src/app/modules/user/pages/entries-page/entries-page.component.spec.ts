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

import { EntriesPageComponent } from './entries-page.component';
import { KeycloakService } from 'keycloak-angular';
import { CoreTestingModule } from '../../../../testing/core-testing-module.spec';
import { AlertService } from '../../../../core/services/alert.service';
import { ConfigService } from '../../../../core/services/config.service';
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;
import { RightConsents } from '@fairandsmart/consents-ce';
import { Observable } from 'rxjs';

describe('EntriesPageComponent', () => {
  let component: EntriesPageComponent;
  let fixture: ComponentFixture<EntriesPageComponent>;
  let keycloakServiceSpy: SpyObj<KeycloakService>;
  let alertServiceSpy: SpyObj<AlertService>;
  let configServiceSpy: SpyObj<ConfigService>;

  beforeEach(waitForAsync(() => {
    keycloakServiceSpy = createSpyObj<KeycloakService>('KeycloakService', ['getUsername']);
    alertServiceSpy = createSpyObj<AlertService>('AlertService', ['error']);
    configServiceSpy = createSpyObj<ConfigService>('ConfigService', ['canLoad']);

    TestBed.configureTestingModule({
      declarations: [EntriesPageComponent],
      imports: [CoreTestingModule],
      providers: [
        {provide: KeycloakService, useValue: keycloakServiceSpy},
        {provide: AlertService, useValue: alertServiceSpy},
        {provide: ConfigService, useValue: configServiceSpy},
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    keycloakServiceSpy.getUsername.and.returnValue('FOO BAR');
    (configServiceSpy as any).config = {userPageElements: []};
    RightConsents.init({apiRoot: '', httpClient: () => new Observable()});

    fixture = TestBed.createComponent(EntriesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
