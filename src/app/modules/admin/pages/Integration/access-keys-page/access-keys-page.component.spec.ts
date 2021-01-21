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
import { ActivatedRouteStubSpec } from '../../../../../testing/activated-route-stub.spec';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { EMPTY } from 'rxjs';
import { AccessKeysPageComponent } from './access-keys-page.component';
import { KeysResourceService } from '../../../../../core/http/keys-resource.service';
import { CoreTestingModule } from '../../../../../testing/core-testing-module.spec';
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;

describe('AccessKeysPageComponent', () => {
  let component: AccessKeysPageComponent;
  let fixture: ComponentFixture<AccessKeysPageComponent>;
  let keysResourceServiceSpy: SpyObj<KeysResourceService>;
  let activatedRouteStub: ActivatedRouteStubSpec;

  beforeEach(waitForAsync(() => {
    keysResourceServiceSpy =  createSpyObj<KeysResourceService>('KeysResourceService', ['listKeys', 'createKey', 'deleteKey']);
    activatedRouteStub = new ActivatedRouteStubSpec();

    TestBed.configureTestingModule({
      declarations: [ AccessKeysPageComponent ],
      imports: [ CoreTestingModule, RouterTestingModule, ReactiveFormsModule ],
      providers: [
        {provide: KeysResourceService, useValue: keysResourceServiceSpy},
        {provide: ActivatedRoute, useValue: activatedRouteStub}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    keysResourceServiceSpy.listKeys.and.returnValue(EMPTY);
    keysResourceServiceSpy.createKey.and.returnValue(EMPTY);

    fixture = TestBed.createComponent(AccessKeysPageComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
