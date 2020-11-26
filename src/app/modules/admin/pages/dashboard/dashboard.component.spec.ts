import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DashboardComponent } from './dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { RouterTestingModule } from '@angular/router/testing';
import { CoreTestingModule } from '../../../../testing/core-testing-module.spec';
import { SystemResourceService } from '../../../../core/http/system-resource.service';
import { EMPTY } from 'rxjs';
import createSpyObj = jasmine.createSpyObj;
import SpyObj = jasmine.SpyObj;

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let systemResourceServiceSpy: SpyObj<SystemResourceService>;

  beforeEach(waitForAsync(() => {
    systemResourceServiceSpy = createSpyObj<SystemResourceService>('SystemResourceService', ['getStats']);

    TestBed.configureTestingModule({
      declarations: [DashboardComponent],
      imports: [
        CoreTestingModule, FormsModule, ReactiveFormsModule, ChartsModule, RouterTestingModule
      ],
      providers: [
        {provide: SystemResourceService, useValue: systemResourceServiceSpy},
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    systemResourceServiceSpy.getStats.and.returnValue(EMPTY);

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
