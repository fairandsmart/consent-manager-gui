import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { RecordsResourceService } from './records-resource.service';

describe('RecordsResourceService', () => {
  let service: RecordsResourceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule
      ]
    });
    service = TestBed.inject(RecordsResourceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
