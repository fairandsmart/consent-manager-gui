import { TestBed } from '@angular/core/testing';

import { EnablingGuardService } from './enabling-guard.service';

describe('EnablingGuardService', () => {
  let service: EnablingGuardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EnablingGuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
