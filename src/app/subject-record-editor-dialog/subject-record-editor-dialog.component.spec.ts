import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectRecordEditorDialogComponent } from './subject-record-editor-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;
import { TranslateModule } from '@ngx-translate/core';

describe('SubjectRecordEditorDialogComponent', () => {
  let component: SubjectRecordEditorDialogComponent;
  let fixture: ComponentFixture<SubjectRecordEditorDialogComponent>;
  let dialogRefSpy: SpyObj<MatDialogRef<SubjectRecordEditorDialogComponent>>;

  beforeEach(async(() => {
    dialogRefSpy = createSpyObj<MatDialogRef<SubjectRecordEditorDialogComponent>>('MatDialogRef', ['close']);

    TestBed.configureTestingModule({
      declarations: [ SubjectRecordEditorDialogComponent ],
      imports: [ ReactiveFormsModule, MaterialModule, NoopAnimationsModule, TranslateModule.forRoot() ],
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
