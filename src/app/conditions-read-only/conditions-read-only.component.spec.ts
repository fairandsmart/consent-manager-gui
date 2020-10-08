import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ConditionsReadOnlyComponent } from './conditions-read-only.component';
import { ActivatedRouteStubSpec } from '../testing/activated-route-stub.spec';
import { ConsentsResourceService } from '../core/http/consents-resource.service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;

describe('ConditionsReadOnlyComponent', () => {
  let component: ConditionsReadOnlyComponent;
  let fixture: ComponentFixture<ConditionsReadOnlyComponent>;
  let consentsResourceServiceSpy: SpyObj<ConsentsResourceService>;
  let activatedRouteStub: ActivatedRouteStubSpec;

  beforeEach(waitForAsync(() => {
    consentsResourceServiceSpy =  createSpyObj<ConsentsResourceService>('ConsentsResourceService', ['generateToken', 'getFormUrl']);
    activatedRouteStub = new ActivatedRouteStubSpec({
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
    consentsResourceServiceSpy.generateToken.and.returnValue(of('TOKEN'));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
