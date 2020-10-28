import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SubjectRecordEditorDialogComponent } from './subject-record-editor-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { CoreTestingModule } from '../../../../../testing/core-testing-module.spec';
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;

describe('SubjectRecordEditorDialogComponent', () => {
  let component: SubjectRecordEditorDialogComponent;
  let fixture: ComponentFixture<SubjectRecordEditorDialogComponent>;
  let dialogRefSpy: SpyObj<MatDialogRef<SubjectRecordEditorDialogComponent>>;

  beforeEach(waitForAsync(() => {
    dialogRefSpy = createSpyObj<MatDialogRef<SubjectRecordEditorDialogComponent>>('MatDialogRef', ['close']);

    TestBed.configureTestingModule({
      declarations: [ SubjectRecordEditorDialogComponent ],
      imports: [ CoreTestingModule, ReactiveFormsModule ],
      providers: [
        {provide: MatDialogRef, useValue: dialogRefSpy},
        {provide: MAT_DIALOG_DATA, useValue: {value: 'foobar'}}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubjectRecordEditorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
