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

import { EntriesLibraryActionsComponent } from './entries-library-actions.component';
import { CoreTestingModule } from '../../../../../testing/core-testing-module.spec';
import { ConfigServiceStubSpec } from '../../../../../testing/config-service-stub.spec';
import { ConfigService } from '../../../../../core/services/config.service';
import { AddMultipleOption } from '../entries-library/entries-library.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ModelEntryStatus } from '@fairandsmart/consent-manager/models';

describe('EntriesLibraryActionsComponent', () => {
  let component: EntriesLibraryActionsComponent;
  let fixture: ComponentFixture<EntriesLibraryActionsComponent>;
  let configServiceStub: ConfigServiceStubSpec;

  beforeEach(waitForAsync(() => {
    configServiceStub = new ConfigServiceStubSpec();

    TestBed.configureTestingModule({
      declarations: [ EntriesLibraryActionsComponent ],
      imports: [ CoreTestingModule, RouterTestingModule ],
      providers: [
        {provide: ConfigService, useValue: configServiceStub}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntriesLibraryActionsComponent);
    component = fixture.componentInstance;
    component.section = {
      id: 'processings',
      types: ['processing'],
      canAddMultiple: AddMultipleOption.ALWAYS,
      showActions: true,
      fullSize: false,
      filter: {
        statuses: [ModelEntryStatus.ACTIVE],
        languages: ['fr']
      }
    };

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
