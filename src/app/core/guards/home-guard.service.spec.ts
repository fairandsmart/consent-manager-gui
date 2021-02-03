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
import { TestBed } from '@angular/core/testing';

import { HomeGuardService } from './home-guard.service';
import { KeycloakService } from 'keycloak-angular';
import { RolesGuardService } from './roles-guard.service';
import { RouterTestingModule } from '@angular/router/testing';
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;

describe('HomeGuardService', () => {
  let service: HomeGuardService;
  let keycloakServiceSpy: SpyObj<KeycloakService>;

  beforeEach(() => {
    keycloakServiceSpy = createSpyObj('KeycloakService', ['getUsername']);

    TestBed.configureTestingModule({
      imports: [ RouterTestingModule ],
      providers: [
        RolesGuardService,
        {provide: KeycloakService, useValue: keycloakServiceSpy}
      ]
    });
    service = TestBed.inject(HomeGuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
