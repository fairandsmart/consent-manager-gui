import { TestBed } from '@angular/core/testing';

import { HealthInterceptor } from './health.interceptor';
import { MaterialModule } from '../material.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';

describe('HealthInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [MaterialModule, NoopAnimationsModule, TranslateModule.forRoot()],
    providers: [
      HealthInterceptor
    ]
  }));

  it('should be created', () => {
    const interceptor: HealthInterceptor = TestBed.inject(HealthInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
