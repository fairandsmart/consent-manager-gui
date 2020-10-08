import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SubjectRecordsComponent } from './subject-records.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { RecordsResourceService } from '../../../../core/http/records-resource.service';
import { EMPTY } from 'rxjs';
import { CoreTestingModule } from '../../../../testing/core-testing-module.spec';
import { ModelsResourceService } from '../../../../core/http/models-resource.service';
import { SubjectsResourceService } from '../../../../core/http/subjects-resource.service';
import { ConsentsResourceService } from '../../../../core/http/consents-resource.service';
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;

describe('SubjectRecordsComponent', () => {
  let component: SubjectRecordsComponent;
  let fixture: ComponentFixture<SubjectRecordsComponent>;
  let modelsResourceServiceSpy: SpyObj<ModelsResourceService>;
  let recordsResourceServiceSpy: SpyObj<RecordsResourceService>;
  let subjectsResourceServiceSpy: SpyObj<SubjectsResourceService>;
  let consentsResourceServiceSpy: SpyObj<ConsentsResourceService>;

  beforeEach(waitForAsync(() => {
    modelsResourceServiceSpy = createSpyObj<ModelsResourceService>('ModelsResourceService', ['listEntries']);
    recordsResourceServiceSpy = createSpyObj<RecordsResourceService>('RecordsResourceService', ['listRecords']);
    subjectsResourceServiceSpy = createSpyObj<SubjectsResourceService>('SubjectsResourceService', ['listSubjects']);
    consentsResourceServiceSpy = createSpyObj<ConsentsResourceService>('ConsentsResourceService', ['generateToken']);

    TestBed.configureTestingModule({
      declarations: [ SubjectRecordsComponent ],
      imports: [ CoreTestingModule, ReactiveFormsModule, RouterTestingModule ],
      providers: [
        {provide: ModelsResourceService, useValue: modelsResourceServiceSpy},
        {provide: RecordsResourceService, useValue: recordsResourceServiceSpy},
        {provide: SubjectsResourceService, useValue: subjectsResourceServiceSpy},
        {provide: ConsentsResourceService, useValue: consentsResourceServiceSpy}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    recordsResourceServiceSpy.listRecords.and.returnValue(EMPTY);

    fixture = TestBed.createComponent(SubjectRecordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
