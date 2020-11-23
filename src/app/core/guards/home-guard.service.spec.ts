import { TestBed } from '@angular/core/testing';

import { HomeGuardService } from './home-guard.service';
import { KeycloakService } from 'keycloak-angular';
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;
import { RolesGuardService } from './roles-guard.service';
import { RouterTestingModule } from '@angular/router/testing';

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
