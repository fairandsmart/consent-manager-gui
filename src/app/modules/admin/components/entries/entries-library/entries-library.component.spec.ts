import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EntriesLibraryComponent } from './entries-library.component';
import { CoreTestingModule } from '../../../../../testing/core-testing-module.spec';

describe('EntriesLibraryComponent', () => {
  let component: EntriesLibraryComponent;
  let fixture: ComponentFixture<EntriesLibraryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EntriesLibraryComponent ],
      imports: [ CoreTestingModule ]
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
