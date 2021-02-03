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

import { EntryCardComponent } from './entry-card.component';
import { CoreTestingModule } from '../../../../../testing/core-testing-module.spec';
import { AlertService } from '../../../../../core/services/alert.service';
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;

describe('EntryCardComponent', () => {
  let component: EntryCardComponent;
  let fixture: ComponentFixture<EntryCardComponent>;
  let alertServiceSpy: SpyObj<AlertService>;

  beforeEach(waitForAsync(() => {
    alertServiceSpy =  createSpyObj('AlertService', ['error']);

    TestBed.configureTestingModule({
      imports: [ CoreTestingModule ],
      declarations: [ EntryCardComponent ],
      providers: [
        {provide: AlertService, useValue: alertServiceSpy}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntryCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
