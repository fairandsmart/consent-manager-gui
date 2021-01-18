import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SubjectRecordApplyChangesDialogComponent } from './subject-record-apply-changes-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { CoreTestingModule } from '../../../../../testing/core-testing-module.spec';
import { ModelsResourceService } from '../../../../../core/http/models-resource.service';
import { EMPTY } from 'rxjs';
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;

describe('SubjectRecordApplyChangesDialogComponent', () => {
  let component: SubjectRecordApplyChangesDialogComponent;
  let fixture: ComponentFixture<SubjectRecordApplyChangesDialogComponent>;
  let dialogRefSpy: SpyObj<MatDialogRef<SubjectRecordApplyChangesDialogComponent>>;
  let modelsResourceServiceSpy: SpyObj<ModelsResourceService>;

  beforeEach(waitForAsync(() => {
    dialogRefSpy = createSpyObj<MatDialogRef<SubjectRecordApplyChangesDialogComponent>>('MatDialogRef', ['close']);
    modelsResourceServiceSpy =  createSpyObj('ModelsResourceService', ['listEntries']);

    TestBed.configureTestingModule({
      declarations: [ SubjectRecordApplyChangesDialogComponent ],
      imports: [ CoreTestingModule, ReactiveFormsModule ],
      providers: [
        {provide: MatDialogRef, useValue: dialogRefSpy},
        {provide: MAT_DIALOG_DATA, useValue: {value: 'foobar'}},
        {provide: ModelsResourceService, useValue: modelsResourceServiceSpy},
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubjectRecordApplyChangesDialogComponent);
    modelsResourceServiceSpy.listEntries.and.returnValue(EMPTY);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
