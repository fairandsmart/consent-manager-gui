import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConditionsReadOnlyComponent } from './conditions-read-only.component';
import { ActivatedRouteStub } from '../testing/activated-route-stub';
import { ConsentsResourceService } from '../consents-resource.service';
import SpyObj = jasmine.SpyObj;
import { ActivatedRoute } from '@angular/router';
import createSpyObj = jasmine.createSpyObj;

describe('ConditionsReadOnlyComponent', () => {
  let component: ConditionsReadOnlyComponent;
  let fixture: ComponentFixture<ConditionsReadOnlyComponent>;
  let consentsResourceServiceSpy: SpyObj<ConsentsResourceService>;
  let activatedRouteStub: ActivatedRouteStub;

  beforeEach(async(() => {
    consentsResourceServiceSpy =  createSpyObj<ConsentsResourceService>('ConsentsResourceService', ['generateToken', 'getFormUrl']);
    activatedRouteStub = new ActivatedRouteStub({
      params: {
        key: 'key',
        owner: 'owner'
      },
      queryParams: {
        lang: 'fr'
      }
    });

    TestBed.configureTestingModule({
      declarations: [ ConditionsReadOnlyComponent ],
      providers: [
        {provide: ConsentsResourceService, useValue: consentsResourceServiceSpy},
        {provide: ActivatedRoute, useValue: activatedRouteStub}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConditionsReadOnlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
