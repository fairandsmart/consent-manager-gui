import { TestBed } from '@angular/core/testing';

import { RolesGuardService } from './roles-guard.service';
import { KeycloakService } from 'keycloak-angular';
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;

describe('RolesGuardService', () => {
  let service: RolesGuardService;
  let keycloakServiceSpy: SpyObj<KeycloakService>;

  beforeEach(() => {
    keycloakServiceSpy = createSpyObj('KeycloakService', ['isUserInRole']);

    TestBed.configureTestingModule({
      providers: [
        RolesGuardService,
        {provide: KeycloakService, useValue: keycloakServiceSpy}
      ]
    });
    service = TestBed.inject(RolesGuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
