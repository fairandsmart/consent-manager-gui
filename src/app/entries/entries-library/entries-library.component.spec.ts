import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntriesLibraryComponent } from './entries-library.component';
import { MaterialModule } from '../../material.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('EntriesLibraryComponent', () => {
  let component: EntriesLibraryComponent;
  let fixture: ComponentFixture<EntriesLibraryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntriesLibraryComponent ],
      imports: [MaterialModule, NoopAnimationsModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntriesLibraryComponent);
    component = fixture.componentInstance;
    component.sections = [];

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
