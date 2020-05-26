import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntryInfoComponent } from './entry-info.component';

describe('EntryInfoComponent', () => {
  let component: EntryInfoComponent;
  let fixture: ComponentFixture<EntryInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntryInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntryInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
