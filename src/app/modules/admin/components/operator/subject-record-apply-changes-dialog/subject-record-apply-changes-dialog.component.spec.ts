import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SubjectRecordApplychangesDialogComponent } from './subject-record-notification-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { CoreTestingModule } from '../../../../../testing/core-testing-module.spec';
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;

describe('SubjectRecordNotificationDialogComponent', () => {
  let component: SubjectRecordApplychangesDialogComponent;
  let fixture: ComponentFixture<SubjectRecordApplychangesDialogComponent>;
  let dialogRefSpy: SpyObj<MatDialogRef<SubjectRecordApplychangesDialogComponent>>;

  beforeEach(waitForAsync(() => {
    dialogRefSpy = createSpyObj<MatDialogRef<SubjectRecordApplychangesDialogComponent>>('MatDialogRef', ['close']);

    TestBed.configureTestingModule({
      declarations: [ SubjectRecordApplychangesDialogComponent ],
      imports: [ CoreTestingModule, ReactiveFormsModule ],
      providers: [
        {provide: MatDialogRef, useValue: dialogRefSpy},
        {provide: MAT_DIALOG_DATA, useValue: {value: 'foobar'}}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubjectRecordApplychangesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
