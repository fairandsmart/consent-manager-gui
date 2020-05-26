import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntriesComponent } from './entries.component';
import { ActivatedRoute } from '@angular/router';
import { ActivatedRouteStub } from '../testing/activated-route-stub';
import { MaterialModule } from '../material.module';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ModelsResourceService } from '../models-resource.service';
import createSpyObj = jasmine.createSpyObj;
import SpyObj = jasmine.SpyObj;

describe('EntriesComponent', () => {
  let component: EntriesComponent;
  let fixture: ComponentFixture<EntriesComponent>;
  let modelsResourceServiceSpy: SpyObj<ModelsResourceService>;
  let activatedRouteStub: ActivatedRouteStub;

  beforeEach(async(() => {
    modelsResourceServiceSpy =  createSpyObj<ModelsResourceService>('ModelsResourceService', ['listEntries']);
    activatedRouteStub = new ActivatedRouteStub();

    TestBed.configureTestingModule({
      declarations: [ EntriesComponent ],
      imports: [
        MaterialModule,
        NoopAnimationsModule
      ],
      providers: [
        {provide: ModelsResourceService, useValue: modelsResourceServiceSpy},
        {provide: ActivatedRoute, useValue: activatedRouteStub}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    modelsResourceServiceSpy.listEntries.and.returnValue(of({
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
