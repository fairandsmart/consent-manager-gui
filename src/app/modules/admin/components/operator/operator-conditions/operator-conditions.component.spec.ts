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

import { OperatorConditionsComponent } from './operator-conditions.component';
import { Observable } from 'rxjs';
import { CoreTestingModule } from '../../../../../testing/core-testing-module.spec';
import { RightConsents } from '@fairandsmart/consent-manager';

describe('OperatorConditionsComponent', () => {
  let component: OperatorConditionsComponent;
  let fixture: ComponentFixture<OperatorConditionsComponent>;

  beforeEach(waitForAsync(() => {

    TestBed.configureTestingModule({
      declarations: [OperatorConditionsComponent],
      imports: [CoreTestingModule],
      providers: [
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {

    RightConsents.init({apiRoot: '', httpClient: () => new Observable(), catalogRoot: ''});
    fixture = TestBed.createComponent(OperatorConditionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
