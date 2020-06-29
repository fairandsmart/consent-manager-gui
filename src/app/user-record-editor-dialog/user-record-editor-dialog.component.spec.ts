import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRecordEditorDialogComponent } from './user-record-editor-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

describe('UserRecordEditorDialogComponent', () => {
  let component: UserRecordEditorDialogComponent;
  let fixture: ComponentFixture<UserRecordEditorDialogComponent>;
  let dialogRefSpy: SpyObj<MatDialogRef<UserRecordEditorDialogComponent>>;

  beforeEach(async(() => {
    dialogRefSpy = createSpyObj<MatDialogRef<UserRecordEditorDialogComponent>>('MatDialogRef', ['close']);

    TestBed.configureTestingModule({
      declarations: [ UserRecordEditorDialogComponent ],
      imports: [ ReactiveFormsModule, MaterialModule, NoopAnimationsModule, TranslateModule.forRoot() ],
      providers: [
        {provide: MatDialogRef, useValue: dialogRefSpy},
        {provide: MAT_DIALOG_DATA, useValue: {value: 'foobar'}}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserRecordEditorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
