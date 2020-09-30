import { TestBed } from '@angular/core/testing';

import { AlertService } from './alert.service';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from '../material.module';

describe('AlertService', () => {
  let service: AlertService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        MaterialModule
      ],
    });
    service = TestBed.inject(AlertService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
