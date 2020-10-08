import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EntryCardComponent } from './entry-card.component';
import { CoreTestingModule } from '../../../../../testing/core-testing-module.spec';

describe('EntryCardComponent', () => {
  let component: EntryCardComponent;
  let fixture: ComponentFixture<EntryCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ CoreTestingModule ],
      declarations: [ EntryCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntryCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
