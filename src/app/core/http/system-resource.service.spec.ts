import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { SystemResourceService } from './system-resource.service';

describe('SystemResourceService', () => {
  let service: SystemResourceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule
      ],
      providers: [
        SystemResourceService
      ]
    });
    service = TestBed.inject(SystemResourceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
