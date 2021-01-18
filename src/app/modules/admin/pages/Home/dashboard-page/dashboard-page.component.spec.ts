import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DashboardPageComponent } from './dashboard-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { RouterTestingModule } from '@angular/router/testing';
import { CoreTestingModule } from '../../../../../testing/core-testing-module.spec';
import { EMPTY } from 'rxjs';
import createSpyObj = jasmine.createSpyObj;
import SpyObj = jasmine.SpyObj;
import { StatisticsResourceService } from '../../../../../core/http/statistics-resource.service';

describe('DashboardPageComponent', () => {
  let component: DashboardPageComponent;
  let fixture: ComponentFixture<DashboardPageComponent>;
  let statsResourceServiceSpy: SpyObj<StatisticsResourceService>;

  beforeEach(waitForAsync(() => {
    statsResourceServiceSpy = createSpyObj<StatisticsResourceService>('StatisticsResourceService', ['getStats']);

    TestBed.configureTestingModule({
      declarations: [DashboardPageComponent],
      imports: [
        CoreTestingModule, FormsModule, ReactiveFormsModule, ChartsModule, RouterTestingModule
      ],
      providers: [
        {provide: StatisticsResourceService, useValue: statsResourceServiceSpy},
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    statsResourceServiceSpy.getStats.and.returnValue(EMPTY);

    fixture = TestBed.createComponent(DashboardPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
