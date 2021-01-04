import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DashboardTopTableComponent } from './dashboard-top-table.component';
import { CoreTestingModule } from '../../../../../testing/core-testing-module.spec';

describe('DashboardTopTableComponent', () => {
  let component: DashboardTopTableComponent;
  let fixture: ComponentFixture<DashboardTopTableComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [CoreTestingModule],
      declarations: [DashboardTopTableComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardTopTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
