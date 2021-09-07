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

import { RoutingErrorPageComponent } from './routing-error-page.component';
import { CoreTestingModule } from '../../../testing/core-testing-module.spec';
import { KeycloakService } from 'keycloak-angular';
import { RouterTestingModule } from '@angular/router/testing';
import { CoreService } from '../../services/core.service';
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;

describe('RoutingErrorPageComponent', () => {
  let component: RoutingErrorPageComponent;
  let fixture: ComponentFixture<RoutingErrorPageComponent>;
  let keycloakServiceSpy: SpyObj<KeycloakService>;
  let coreServiceSpy: SpyObj<CoreService>;

  beforeEach(waitForAsync(() => {
    keycloakServiceSpy = createSpyObj<KeycloakService>('KeycloakService', ['getUsername', 'isUserInRole']);
    coreServiceSpy = createSpyObj<CoreService>('CoreService', ['checkInfo']);

    TestBed.configureTestingModule({
      declarations: [ RoutingErrorPageComponent ],
      imports: [ CoreTestingModule, RouterTestingModule ],
      providers: [
        {provide: KeycloakService, useValue: keycloakServiceSpy},
        {provide: CoreService, useValue: coreServiceSpy}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    keycloakServiceSpy.getUsername.and.returnValue('FOO BAR');
    keycloakServiceSpy.isUserInRole.and.returnValue(true);

    fixture = TestBed.createComponent(RoutingErrorPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
