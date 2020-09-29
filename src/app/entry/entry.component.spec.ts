import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntryComponent } from './entry.component';
import { ActivatedRoute } from '@angular/router';
import { ActivatedRouteStub } from '../testing/activated-route-stub';
import { EMPTY, of } from 'rxjs';
import { ModelsResourceService } from '../services/models-resource.service';
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;

describe('EntryComponent', () => {
  let component: EntryComponent;
  let fixture: ComponentFixture<EntryComponent>;
  let modelsResourceServiceSpy: SpyObj<ModelsResourceService>;
  let activatedRouteStub: ActivatedRouteStub;

  beforeEach(async(() => {
    modelsResourceServiceSpy =  createSpyObj<ModelsResourceService>('ModelsResourceService', ['getEntry', 'getVersion']);
    activatedRouteStub = new ActivatedRouteStub({
      params: {
        id: '123e4567-e89b-12d3-a456-426614174000'
      }
    });

    TestBed.configureTestingModule({
      declarations: [ EntryComponent ],
      providers: [
        {provide: ModelsResourceService, useValue: modelsResourceServiceSpy},
        {provide: ActivatedRoute, useValue: activatedRouteStub},
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    modelsResourceServiceSpy.getEntry.and.returnValue(EMPTY);
    modelsResourceServiceSpy.getVersion.and.returnValue(EMPTY);

    fixture = TestBed.createComponent(EntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
