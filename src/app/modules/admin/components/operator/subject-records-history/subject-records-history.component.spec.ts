import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SubjectRecordsHistoryComponent } from './subject-records-history.component';
import { CoreTestingModule } from '../../../../../testing/core-testing-module.spec';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;

describe('SubjectRecordsHistoryComponent', () => {
  let component: SubjectRecordsHistoryComponent;
  let fixture: ComponentFixture<SubjectRecordsHistoryComponent>;
  let dialogRefSpy: SpyObj<MatDialogRef<SubjectRecordsHistoryComponent>>;

  beforeEach(waitForAsync(() => {
    dialogRefSpy = createSpyObj<MatDialogRef<SubjectRecordsHistoryComponent>>('MatDialogRef', ['close']);

    TestBed.configureTestingModule({
      declarations: [ SubjectRecordsHistoryComponent ],
      imports: [ CoreTestingModule ],
      providers: [
        {provide: MatDialogRef, useValue: dialogRefSpy},
        {provide: MAT_DIALOG_DATA, useValue: []},
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubjectRecordsHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
