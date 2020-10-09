import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DashboardComponent } from './dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { RecordsResourceService } from '../../../../core/http/records-resource.service';
import { EMPTY } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { SubjectsResourceService } from '../../../../core/http/subjects-resource.service';
import { CoreTestingModule } from '../../../../testing/core-testing-module.spec';
import createSpyObj = jasmine.createSpyObj;
import SpyObj = jasmine.SpyObj;

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let recordsResourceServiceSpy: SpyObj<RecordsResourceService>;
  let subjectsResourceServiceSpy: SpyObj<SubjectsResourceService>;

  beforeEach(waitForAsync(() => {
    recordsResourceServiceSpy = createSpyObj<RecordsResourceService>('RecordsResourceService', ['getStats']);
    subjectsResourceServiceSpy = createSpyObj<SubjectsResourceService>('SubjectsResourceService', ['listSubjects']);

    TestBed.configureTestingModule({
      declarations: [DashboardComponent],
      imports: [
        CoreTestingModule, FormsModule, ReactiveFormsModule, ChartsModule, RouterTestingModule
      ],
      providers: [
        {provide: RecordsResourceService, useValue: recordsResourceServiceSpy},
        {provide: SubjectsResourceService, useValue: subjectsResourceServiceSpy}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    subjectsResourceServiceSpy.listSubjects.and.returnValue(EMPTY);
    recordsResourceServiceSpy.getStats.and.returnValue(EMPTY);

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});