import { TestBed } from '@angular/core/testing';

import { UserGuardService } from './user-guard.service';
import { KeycloakService } from 'keycloak-angular';
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;
import { RolesGuardService } from './roles-guard.service';

describe('UserGuardService', () => {
  let service: UserGuardService;
  let keycloakServiceSpy: SpyObj<KeycloakService>;

  beforeEach(() => {
    keycloakServiceSpy = createSpyObj('KeycloakService', ['getUsername']);

    TestBed.configureTestingModule({
      providers: [
        RolesGuardService,
        {provide: KeycloakService, useValue: keycloakServiceSpy}
      ]
    });
    service = TestBed.inject(UserGuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
