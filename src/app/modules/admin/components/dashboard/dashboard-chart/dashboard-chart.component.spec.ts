import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DashboardChartComponent } from './dashboard-chart.component';
import { CoreTestingModule } from '../../../../../testing/core-testing-module.spec';

describe('DashboardChartComponent', () => {
  let component: DashboardChartComponent;
  let fixture: ComponentFixture<DashboardChartComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ CoreTestingModule ],
      declarations: [DashboardChartComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
