import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EntryEditorDialogComponent } from './entry-editor-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { ModelsResourceService } from '../../../../../core/http/models-resource.service';
import { CoreTestingModule } from '../../../../../testing/core-testing-module.spec';
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;

describe('EntryEditorDialogComponent', () => {
  let component: EntryEditorDialogComponent;
  let fixture: ComponentFixture<EntryEditorDialogComponent>;
  let dialogRefSpy: SpyObj<MatDialogRef<EntryEditorDialogComponent>>;
  let modelsResourceServiceSpy: SpyObj<ModelsResourceService>;

  beforeEach(waitForAsync(() => {
    dialogRefSpy = createSpyObj<MatDialogRef<EntryEditorDialogComponent>>('MatDialogRef', ['close']);
    modelsResourceServiceSpy =  createSpyObj<ModelsResourceService>('ModelsResourceService', ['listEntries']);

    TestBed.configureTestingModule({
      declarations: [ EntryEditorDialogComponent ],
      imports: [ CoreTestingModule, ReactiveFormsModule ],
      providers: [
        {provide: MatDialogRef, useValue: dialogRefSpy},
        {provide: MAT_DIALOG_DATA, useValue: {entry: {type: 'treatment'}}},
        {provide: ModelsResourceService, useValue: modelsResourceServiceSpy},
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntryEditorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
