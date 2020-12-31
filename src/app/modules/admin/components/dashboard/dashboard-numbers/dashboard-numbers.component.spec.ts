import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DashboardNumbersComponent } from './dashboard-numbers.component';
import { CoreTestingModule } from '../../../../../testing/core-testing-module.spec';

describe('DashboardNumbersComponent', () => {
  let component: DashboardNumbersComponent;
  let fixture: ComponentFixture<DashboardNumbersComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ CoreTestingModule ],
      declarations: [DashboardNumbersComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardNumbersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
