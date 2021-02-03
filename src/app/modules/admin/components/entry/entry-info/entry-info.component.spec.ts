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

import { EntryInfoComponent } from './entry-info.component';
import { CoreTestingModule } from '../../../../../testing/core-testing-module.spec';
import { RecordsResourceService } from '../../../../../core/http/records-resource.service';
import { ModelsResourceService } from '../../../../../core/http/models-resource.service';
import { AlertService } from '../../../../../core/services/alert.service';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import createSpyObj = jasmine.createSpyObj;
import SpyObj = jasmine.SpyObj;

describe('EntryInfoComponent', () => {
  let component: EntryInfoComponent;
  let fixture: ComponentFixture<EntryInfoComponent>;
  let recordServiceSpy: SpyObj<RecordsResourceService>;
  let modelsResourceServiceSpy: SpyObj<ModelsResourceService>;
  let alertServiceSpy: SpyObj<AlertService>;

  beforeEach(waitForAsync(() => {
    recordServiceSpy = createSpyObj<RecordsResourceService>('RecordsResourceService', ['extractRecords']);
    modelsResourceServiceSpy = createSpyObj<ModelsResourceService>('ModelsResourceService', ['deleteModel']);
    alertServiceSpy = createSpyObj<AlertService>('AlertService', ['error', 'success']);
    TestBed.configureTestingModule({
      declarations: [ EntryInfoComponent ],
      imports: [ CoreTestingModule, RouterTestingModule ],
      providers: [
        {provide: ModelsResourceService, useValue: modelsResourceServiceSpy},
        {provide: RecordsResourceService, useValue: recordServiceSpy},
        {provide: AlertService, useValue: alertServiceSpy},
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    recordServiceSpy.extractRecords.and.returnValue(of([]));
    fixture = TestBed.createComponent(EntryInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
