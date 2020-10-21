import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FormUrlDialogComponent } from './form-url-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { CoreTestingModule } from '../../../../testing/core-testing-module.spec';
import createSpyObj = jasmine.createSpyObj;
import SpyObj = jasmine.SpyObj;

describe('FormUrlDialogComponent', () => {
  let component: FormUrlDialogComponent;
  let fixture: ComponentFixture<FormUrlDialogComponent>;
  let dialogRefSpy: SpyObj<MatDialogRef<FormUrlDialogComponent>>;

  beforeEach(waitForAsync(() => {
    dialogRefSpy = createSpyObj<MatDialogRef<FormUrlDialogComponent>>('MatDialogRef', ['close']);

    TestBed.configureTestingModule({
      declarations: [ FormUrlDialogComponent ],
      imports: [ CoreTestingModule, ReactiveFormsModule, ClipboardModule ],
      providers: [
        {provide: MatDialogRef, useValue: dialogRefSpy},
        {provide: MAT_DIALOG_DATA, useValue: {
          url: 'http://foo.bar',
            context: {
              elements: []
            }
          }
        }
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
