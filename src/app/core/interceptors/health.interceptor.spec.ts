import { TestBed } from '@angular/core/testing';

import { HealthInterceptor } from './health.interceptor';
import { CoreTestingModule } from '../../testing/core-testing-module.spec';

describe('HealthInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [ CoreTestingModule ],
    providers: [
      HealthInterceptor
    ]
  }));

  it('should be created', () => {
    const interceptor: HealthInterceptor = TestBed.inject(HealthInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
