import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntriesComponent } from './entries.component';
import { ConsentsResourceService } from '../consents-resource.service';
import { ActivatedRoute } from '@angular/router';
import { ActivatedRouteStub } from '../testing/activated-route-stub';
import { MaterialModule } from '../material.module';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import createSpyObj = jasmine.createSpyObj;
import SpyObj = jasmine.SpyObj;

describe('EntriesComponent', () => {
  let component: EntriesComponent;
  let fixture: ComponentFixture<EntriesComponent>;
  let consentsResourceServiceSpy: SpyObj<ConsentsResourceService>;
  let activatedRouteStub: ActivatedRouteStub;

  beforeEach(async(() => {
    consentsResourceServiceSpy =  createSpyObj<ConsentsResourceService>('ConsentsResourceService', ['listEntries']);
    activatedRouteStub = new ActivatedRouteStub();

    TestBed.configureTestingModule({
      declarations: [ EntriesComponent ],
      imports: [
        MaterialModule,
        NoopAnimationsModule
      ],
      providers: [
        {provide: ConsentsResourceService, useValue: consentsResourceServiceSpy},
        {provide: ActivatedRoute, useValue: activatedRouteStub}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    consentsResourceServiceSpy.listEntries.and.returnValue(of({
      values: [],
      page: 0,
      pageSize: 0,
      totalCount: 0,
      totalPages: 0,
    }));

    fixture = TestBed.createComponent(EntriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
