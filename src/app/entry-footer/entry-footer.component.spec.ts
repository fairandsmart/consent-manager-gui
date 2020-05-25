import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntryFooterComponent } from './entry-footer.component';

describe('EntryFooterComponent', () => {
  let component: EntryFooterComponent;
  let fixture: ComponentFixture<EntryFooterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntryFooterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntryFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
