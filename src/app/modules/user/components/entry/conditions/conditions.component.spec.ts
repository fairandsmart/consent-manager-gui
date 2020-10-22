import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ConditionsComponent } from './conditions.component';
import { CoreTestingModule } from '../../../../../testing/core-testing-module.spec';

describe('ConditionsComponent', () => {
  let component: ConditionsComponent;
  let fixture: ComponentFixture<ConditionsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ConditionsComponent ],
      imports: [ CoreTestingModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConditionsComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
