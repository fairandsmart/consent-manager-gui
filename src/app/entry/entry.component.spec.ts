import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntryComponent } from './entry.component';
import { ActivatedRoute } from '@angular/router';
import { ConsentsResourceService } from '../consents-resource.service';
import { ActivatedRouteStub } from '../testing/activated-route-stub';
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;
import { of } from 'rxjs';

describe('EntryComponent', () => {
  let component: EntryComponent;
  let fixture: ComponentFixture<EntryComponent>;
  let consentsResourceServiceSpy: SpyObj<ConsentsResourceService>;
  let activatedRouteStub: ActivatedRouteStub;

  beforeEach(async(() => {
    consentsResourceServiceSpy =  createSpyObj<ConsentsResourceService>('ConsentsResourceService', ['getEntry']);
    activatedRouteStub = new ActivatedRouteStub({
      params: {
        id: '123e4567-e89b-12d3-a456-426614174000'
      }
    });

    TestBed.configureTestingModule({
      declarations: [ EntryComponent ],
      providers: [
        {provide: ConsentsResourceService, useValue: consentsResourceServiceSpy},
        {provide: ActivatedRoute, useValue: activatedRouteStub},
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    consentsResourceServiceSpy.getEntry.and.returnValue(of(null));

    fixture = TestBed.createComponent(EntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
