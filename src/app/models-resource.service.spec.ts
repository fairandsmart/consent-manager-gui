import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { ModelsResourceService } from './models-resource.service';

describe('ModelsResourceService', () => {
  let service: ModelsResourceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule
      ]
    });
    service = TestBed.inject(ModelsResourceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
