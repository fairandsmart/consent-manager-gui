import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntryPreviewComponent } from './entry-preview.component';

describe('EntryPreviewComponent', () => {
  let component: EntryPreviewComponent;
  let fixture: ComponentFixture<EntryPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EntryPreviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EntryPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
