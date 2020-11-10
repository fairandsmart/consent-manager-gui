import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SubjectInfosEditorDialogComponent } from './subject-infos-editor-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;
import { CoreTestingModule } from '../../../../../testing/core-testing-module.spec';

describe('SubjectInfosEditorDialogComponent', () => {
  let component: SubjectInfosEditorDialogComponent;
  let fixture: ComponentFixture<SubjectInfosEditorDialogComponent>;
  let dialogRefSpy: SpyObj<MatDialogRef<SubjectInfosEditorDialogComponent>>;

  beforeEach(waitForAsync(() => {
    dialogRefSpy = createSpyObj<MatDialogRef<SubjectInfosEditorDialogComponent>>('MatDialogRef', ['close']);

    TestBed.configureTestingModule({
      declarations: [ SubjectInfosEditorDialogComponent ],
      imports: [ CoreTestingModule ],
      providers: [
        {provide: MatDialogRef, useValue: dialogRefSpy},
        {provide: MAT_DIALOG_DATA, useValue: { subject: {} }}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubjectInfosEditorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
