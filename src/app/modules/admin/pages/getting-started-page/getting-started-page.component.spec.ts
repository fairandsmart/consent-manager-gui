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
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GettingStartedPageComponent } from './getting-started-page.component';
import { CoreTestingModule } from '../../../../testing/core-testing-module.spec';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { ActivatedRouteStubSpec } from '../../../../testing/activated-route-stub.spec';
import { ActivatedRoute, UrlSegment } from '@angular/router';

describe('GettingStartedPageComponent', () => {
  let component: GettingStartedPageComponent;
  let fixture: ComponentFixture<GettingStartedPageComponent>;
  let activatedRouteStub: ActivatedRouteStubSpec;

  beforeEach(async () => {
    activatedRouteStub = new ActivatedRouteStubSpec({url: [new UrlSegment('configuration', {})]});

    await TestBed.configureTestingModule({
      declarations: [ GettingStartedPageComponent ],
      imports: [ CoreTestingModule, RouterTestingModule, NoopAnimationsModule, TranslateModule.forRoot() ],
      providers: [
        {provide: ActivatedRoute, useValue: activatedRouteStub}
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GettingStartedPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
