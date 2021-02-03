/*-
 * #%L
 * Right Consents, a Universal Consents & Preferences Management Platform.
 * %%
 * Copyright (C) 2020 - 2021 Fair And Smart
 * %%
 * This file is part of Right Consents Community Edition.
 *
 * Right Consents Community Edition is published by FAIR AND SMART under the
 * GNU GENERAL PUBLIC LICENCE Version 3 (GPLv3) and a set of additional terms.
 *
 * For more information, please see the “LICENSE” and “LICENSE.FAIRANDSMART”
 * files, or see https://www.fairandsmart.com/opensource/.
 * #L%
 */
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DashboardPageComponent } from './dashboard-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { RouterTestingModule } from '@angular/router/testing';
import { CoreTestingModule } from '../../../../../testing/core-testing-module.spec';
import { EMPTY } from 'rxjs';
import { StatisticsResourceService } from '../../../../../core/http/statistics-resource.service';
import createSpyObj = jasmine.createSpyObj;
import SpyObj = jasmine.SpyObj;

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
