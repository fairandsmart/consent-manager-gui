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
import { AlertService } from '../../../../../core/services/alert.service';
import { Observable } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import createSpyObj = jasmine.createSpyObj;
import SpyObj = jasmine.SpyObj;
import { RightConsents } from '@fairandsmart/consent-manager';

describe('EntryInfoComponent', () => {
  let component: EntryInfoComponent;
  let fixture: ComponentFixture<EntryInfoComponent>;
  let alertServiceSpy: SpyObj<AlertService>;

  beforeEach(waitForAsync(() => {
    alertServiceSpy = createSpyObj<AlertService>('AlertService', ['error', 'success']);
    TestBed.configureTestingModule({
      declarations: [ EntryInfoComponent ],
      imports: [ CoreTestingModule, RouterTestingModule ],
      providers: [
        {provide: AlertService, useValue: alertServiceSpy},
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    RightConsents.init({apiRoot: '', httpClient: () => new Observable(), catalogRoot: ''});
    fixture = TestBed.createComponent(EntryInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
