import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EntryInfoComponent } from './entry-info.component';
import { CoreTestingModule } from '../../../../../testing/core-testing-module.spec';

describe('EntryInfoComponent', () => {
  let component: EntryInfoComponent;
  let fixture: ComponentFixture<EntryInfoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EntryInfoComponent ],
      imports: [ CoreTestingModule ],
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
