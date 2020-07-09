import { TestBed } from '@angular/core/testing';

import { HealthInterceptor } from './health.interceptor';

describe('HealthInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      HealthInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: HealthInterceptor = TestBed.inject(HealthInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
