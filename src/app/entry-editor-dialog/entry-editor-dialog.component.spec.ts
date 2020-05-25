import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntryEditorDialogComponent } from './entry-editor-dialog.component';

describe('EntryEditorDialogComponent', () => {
  let component: EntryEditorDialogComponent;
  let fixture: ComponentFixture<EntryEditorDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntryEditorDialogComponent ]
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
