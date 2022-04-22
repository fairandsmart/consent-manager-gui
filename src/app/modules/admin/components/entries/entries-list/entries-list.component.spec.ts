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

import { EntriesListComponent } from './entries-list.component';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ActivatedRouteStubSpec } from '../../../../../testing/activated-route-stub.spec';
import { Observable } from 'rxjs';
import { CoreTestingModule } from '../../../../../testing/core-testing-module.spec';
import { AddMultipleOption } from '../entries-library/entries-library.component';
import { ConfigServiceStubSpec } from '../../../../../testing/config-service-stub.spec';
import { ConfigService } from '../../../../../core/services/config.service';
import { RightConsents } from '@fairandsmart/consents-ce';
import { KeycloakService } from 'keycloak-angular';
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;

describe('EntriesListComponent', () => {
  let component: EntriesListComponent;
  let fixture: ComponentFixture<EntriesListComponent>;
  let keycloakServiceSpy: SpyObj<KeycloakService>;
  let activatedRouteStub: ActivatedRouteStubSpec;
  let configServiceStub: ConfigServiceStubSpec;

  beforeEach(waitForAsync(() => {
    keycloakServiceSpy = createSpyObj('KeycloakService', ['isUserInRole']);
    activatedRouteStub = new ActivatedRouteStubSpec();
    configServiceStub = new ConfigServiceStubSpec();

    TestBed.configureTestingModule({
      declarations: [ EntriesListComponent ],
      imports: [ CoreTestingModule, RouterTestingModule, FormsModule ],
      providers: [
        {provide: KeycloakService, useValue: keycloakServiceSpy},
        {provide: ActivatedRoute, useValue: activatedRouteStub},
        {provide: ConfigService, useValue: configServiceStub}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {

    RightConsents.init({apiRoot: '', httpClient: () => new Observable()});
    fixture = TestBed.createComponent(EntriesListComponent);
    component = fixture.componentInstance;
    component.section = {
      id: 'infos',
      types: ['information'],
      canAddMultiple: AddMultipleOption.ALWAYS,
      showActions: true,
      fullSize: false,
    };

    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
