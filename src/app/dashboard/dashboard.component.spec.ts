import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardComponent } from './dashboard.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { ChartsModule } from 'ng2-charts';
import { RecordsResourceService } from '../services/records-resource.service';
import { EMPTY } from 'rxjs';
import createSpyObj = jasmine.createSpyObj;
import SpyObj = jasmine.SpyObj;
import { RouterTestingModule } from '@angular/router/testing';
import { SubjectsResourceService } from '../services/subjects-resource.service';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let recordsResourceServiceSpy: SpyObj<RecordsResourceService>;
  let subjectsResourceServiceSpy: SpyObj<SubjectsResourceService>;

  beforeEach(async(() => {
    recordsResourceServiceSpy = createSpyObj<RecordsResourceService>('RecordsResourceService', ['getStats']);
    subjectsResourceServiceSpy = createSpyObj<SubjectsResourceService>('SubjectsResourceService', ['listSubjects']);

    TestBed.configureTestingModule({
      declarations: [DashboardComponent],
      imports: [
        ReactiveFormsModule, MaterialModule, NoopAnimationsModule, TranslateModule.forRoot(), ChartsModule, RouterTestingModule
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
