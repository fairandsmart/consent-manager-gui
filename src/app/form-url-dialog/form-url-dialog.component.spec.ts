import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormUrlDialogComponent } from './form-url-dialog.component';

describe('FormUrlDialogComponent', () => {
  let component: FormUrlDialogComponent;
  let fixture: ComponentFixture<FormUrlDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormUrlDialogComponent ]
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
