import { TestBed } from '@angular/core/testing';

import { AlertService } from './alert.service';
import { CoreTestingModule } from '../../testing/core-testing-module.spec';

describe('AlertService', () => {
  let service: AlertService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ CoreTestingModule ],
    });
    service = TestBed.inject(AlertService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
