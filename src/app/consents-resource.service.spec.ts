import { TestBed } from '@angular/core/testing';

import { ConsentsResourceService } from './consents-resource.service';
import { HttpClientModule } from '@angular/common/http';

describe('ConsentsResourceService', () => {
  let service: ConsentsResourceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule
      ]
    });
    service = TestBed.inject(ConsentsResourceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
