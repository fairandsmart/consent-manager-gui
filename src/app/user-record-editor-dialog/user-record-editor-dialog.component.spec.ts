import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRecordEditorDialogComponent } from './user-record-editor-dialog.component';

describe('UserRecordEditorDialogComponent', () => {
  let component: UserRecordEditorDialogComponent;
  let fixture: ComponentFixture<UserRecordEditorDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserRecordEditorDialogComponent ]
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
