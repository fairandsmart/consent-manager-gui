import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardComponent } from './dashboard.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { ChartsModule } from 'ng2-charts';
import { RecordsResourceService } from '../records-resource.service';
import { EMPTY } from 'rxjs';
import createSpyObj = jasmine.createSpyObj;
import SpyObj = jasmine.SpyObj;
import { RouterTestingModule } from '@angular/router/testing';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let recordsResourceServiceSpy: SpyObj<RecordsResourceService>;

  beforeEach(async(() => {
    recordsResourceServiceSpy =  createSpyObj<RecordsResourceService>('RecordsResourceService', ['findSubjects', 'getStats']);

    TestBed.configureTestingModule({
      declarations: [ DashboardComponent ],
      imports: [ ReactiveFormsModule, MaterialModule, NoopAnimationsModule, TranslateModule.forRoot(), ChartsModule, RouterTestingModule ],
      providers: [
        {provide: RecordsResourceService, useValue: recordsResourceServiceSpy},
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    recordsResourceServiceSpy.findSubjects.and.returnValue(EMPTY);
    recordsResourceServiceSpy.getStats.and.returnValue(EMPTY);

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
