import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { KeysResourceService } from './keys-resource.service';

describe('KeysResourceService', () => {
  let service: KeysResourceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule
      ],
      providers: [
        KeysResourceService
      ]
    });
    service = TestBed.inject(KeysResourceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
