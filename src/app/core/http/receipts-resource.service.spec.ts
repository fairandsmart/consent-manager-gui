import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { ReceiptsResourceService } from './receipts-resource.service';

describe('ReceiptsResourceService', () => {
  let service: ReceiptsResourceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule
      ],
      providers: [
        ReceiptsResourceService
      ]
    });
    service = TestBed.inject(ReceiptsResourceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
