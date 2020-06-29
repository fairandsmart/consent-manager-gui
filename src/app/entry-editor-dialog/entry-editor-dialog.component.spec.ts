import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntryEditorDialogComponent } from './entry-editor-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ModelsResourceService } from '../models-resource.service';
import { TranslateModule } from '@ngx-translate/core';

describe('EntryEditorDialogComponent', () => {
  let component: EntryEditorDialogComponent;
  let fixture: ComponentFixture<EntryEditorDialogComponent>;
  let dialogRefSpy: SpyObj<MatDialogRef<EntryEditorDialogComponent>>;
  let modelsResourceServiceSpy: SpyObj<ModelsResourceService>;

  beforeEach(async(() => {
    dialogRefSpy = createSpyObj<MatDialogRef<EntryEditorDialogComponent>>('MatDialogRef', ['close']);
    modelsResourceServiceSpy =  createSpyObj<ModelsResourceService>('ModelsResourceService', ['listEntries']);

    TestBed.configureTestingModule({
      declarations: [ EntryEditorDialogComponent ],
      imports: [ ReactiveFormsModule, MaterialModule, NoopAnimationsModule, TranslateModule.forRoot() ],
      providers: [
        {provide: MatDialogRef, useValue: dialogRefSpy},
        {provide: MAT_DIALOG_DATA, useValue: {value: 'foobar'}},
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
