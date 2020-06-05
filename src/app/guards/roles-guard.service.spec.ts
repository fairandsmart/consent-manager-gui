import { TestBed } from '@angular/core/testing';

import { RolesGuardService } from './roles-guard.service';

describe('RolesGuardService', () => {
  let service: RolesGuardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RolesGuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
