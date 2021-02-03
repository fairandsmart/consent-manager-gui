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

import { ModelEntryPageComponent } from './model-entry-page.component';
import { ActivatedRoute } from '@angular/router';
import { ActivatedRouteStubSpec } from '../../../../../testing/activated-route-stub.spec';
import { EMPTY } from 'rxjs';
import { ModelsResourceService } from '../../../../../core/http/models-resource.service';
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;

describe('ModelEntryPageComponent', () => {
  let component: ModelEntryPageComponent;
  let fixture: ComponentFixture<ModelEntryPageComponent>;
  let modelsResourceServiceSpy: SpyObj<ModelsResourceService>;
  let activatedRouteStub: ActivatedRouteStubSpec;

  beforeEach(waitForAsync(() => {
    modelsResourceServiceSpy =  createSpyObj<ModelsResourceService>('ModelsResourceService', ['getEntry', 'getVersion']);
    activatedRouteStub = new ActivatedRouteStubSpec({
      params: {
        id: '123e4567-e89b-12d3-a456-426614174000'
      }
    });

    TestBed.configureTestingModule({
      declarations: [ ModelEntryPageComponent ],
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

    fixture = TestBed.createComponent(ModelEntryPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
