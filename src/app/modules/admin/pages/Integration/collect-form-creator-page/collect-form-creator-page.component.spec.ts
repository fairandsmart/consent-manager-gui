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

import { CollectFormCreatorPageComponent } from './collect-form-creator-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CoreTestingModule } from '../../../../../testing/core-testing-module.spec';
import { ConfigServiceStubSpec } from '../../../../../testing/config-service-stub.spec';
import { ConfigService } from '../../../../../core/services/config.service';
import { RightConsents } from '@fairandsmart/consent-manager';

describe('CollectFormCreatorPageComponent', () => {
  let component: CollectFormCreatorPageComponent;
  let fixture: ComponentFixture<CollectFormCreatorPageComponent>;
  let configServiceStub: ConfigServiceStubSpec;

  beforeEach(waitForAsync(() => {
    configServiceStub = new ConfigServiceStubSpec();

    TestBed.configureTestingModule({
      declarations: [ CollectFormCreatorPageComponent ],
      imports: [ CoreTestingModule, FormsModule, ReactiveFormsModule ],
      providers: [
        {provide: ConfigService, useValue: configServiceStub}
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    RightConsents.init({apiRoot: '', httpClient: () => new Observable(), catalogRoot: ''});
    fixture = TestBed.createComponent(CollectFormCreatorPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
