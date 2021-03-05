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

import { BasicinfoComponent } from './basicinfo.component';
import { ReactiveFormsModule } from '@angular/forms';
import { EntryPreviewComponent } from '../entry-preview/entry-preview.component';
import { CoreTestingModule } from '../../../../../testing/core-testing-module.spec';
import { RouterTestingModule } from '@angular/router/testing';
import { ConfigServiceStubSpec } from '../../../../../testing/config-service-stub.spec';
import { ConfigService } from '../../../../../core/services/config.service';
import { ModelEntryStatus } from '@fairandsmart/consent-manager/models';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('BasicinfoComponent', () => {
  let component: BasicinfoComponent;
  let fixture: ComponentFixture<BasicinfoComponent>;
  let configServiceStub: ConfigServiceStubSpec;

  beforeEach(waitForAsync(() => {
    configServiceStub = new ConfigServiceStubSpec();

    TestBed.configureTestingModule({
      declarations: [ BasicinfoComponent, EntryPreviewComponent ],
      imports: [ CoreTestingModule, RouterTestingModule, ReactiveFormsModule ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {provide: ConfigService, useValue: configServiceStub}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BasicinfoComponent);
    component = fixture.componentInstance;
    component.entry = {
      id: 'foo',
      key: 'bar',
      name: 'foo',
      description: 'bar',
      type: 'basicinfo',
      versions: [],
      creationDate: 12,
      modificationDate: 42,
      status: ModelEntryStatus.ACTIVE,
      defaultLanguage: 'fr',
      availableLanguages: ['fr']
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
