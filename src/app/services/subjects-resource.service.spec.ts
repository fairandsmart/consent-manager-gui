import { TestBed } from '@angular/core/testing';

import { SubjectsResourceService } from './subjects-resource.service';
import { HttpClientModule } from '@angular/common/http';

describe('SubjectsResourceService', () => {
  let service: SubjectsResourceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule
      ]
    });
    service = TestBed.inject(SubjectsResourceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
