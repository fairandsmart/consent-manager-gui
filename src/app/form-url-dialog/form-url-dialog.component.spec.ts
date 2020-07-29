import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormUrlDialogComponent } from './form-url-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import createSpyObj = jasmine.createSpyObj;
import SpyObj = jasmine.SpyObj;
import { ClipboardModule } from '@angular/cdk/clipboard';

describe('FormUrlDialogComponent', () => {
  let component: FormUrlDialogComponent;
  let fixture: ComponentFixture<FormUrlDialogComponent>;
  let dialogRefSpy: SpyObj<MatDialogRef<FormUrlDialogComponent>>;

  beforeEach(async(() => {
    dialogRefSpy = createSpyObj<MatDialogRef<FormUrlDialogComponent>>('MatDialogRef', ['close']);

    TestBed.configureTestingModule({
      declarations: [ FormUrlDialogComponent ],
      imports: [ FormsModule, ReactiveFormsModule, MaterialModule, NoopAnimationsModule, TranslateModule.forRoot(), ClipboardModule ],
      providers: [
        {provide: MatDialogRef, useValue: dialogRefSpy},
        {provide: MAT_DIALOG_DATA, useValue: {url: 'http://foo.bar'}}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormUrlDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
