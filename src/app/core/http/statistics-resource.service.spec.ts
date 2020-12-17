import { TestBed } from '@angular/core/testing';

import { StatisticsResourceService } from './statistics-resource.service';
import { HttpClientModule } from '@angular/common/http';
import { SubjectsResourceService } from './subjects-resource.service';

describe('StatisticsResourceService', () => {
  let service: StatisticsResourceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule
      ],
      providers: [
        SubjectsResourceService
      ]
    });
    service = TestBed.inject(StatisticsResourceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
