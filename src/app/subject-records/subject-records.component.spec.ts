import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectRecordsComponent } from './subject-records.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { RecordsResourceService } from '../records-resource.service';
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;
import { EMPTY } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';

describe('SubjectRecordsComponent', () => {
  let component: SubjectRecordsComponent;
  let fixture: ComponentFixture<SubjectRecordsComponent>;
  let recordsResourceServiceSpy: SpyObj<RecordsResourceService>;

  beforeEach(async(() => {
    recordsResourceServiceSpy = createSpyObj<RecordsResourceService>('RecordsResourceService', ['listRecords']);

    TestBed.configureTestingModule({
      declarations: [ SubjectRecordsComponent ],
      imports: [
        ReactiveFormsModule, MaterialModule, NoopAnimationsModule, TranslateModule.forRoot(), RouterTestingModule, HttpClientModule
      ],
      providers: [
        {provide: RecordsResourceService, useValue: recordsResourceServiceSpy}
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
