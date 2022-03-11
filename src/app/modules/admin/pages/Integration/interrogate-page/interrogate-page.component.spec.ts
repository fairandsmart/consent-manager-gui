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

import { InterrogatePageComponent } from './interrogate-page.component';
import { Observable } from 'rxjs';
import { CoreTestingModule } from '../../../../../testing/core-testing-module.spec';
import { ConfigServiceStubSpec } from '../../../../../testing/config-service-stub.spec';
import { ConfigService } from '../../../../../core/services/config.service';
import { RightConsents } from '@fairandsmart/consents-ce';

describe('InterrogatePageComponent', () => {
  let component: InterrogatePageComponent;
  let fixture: ComponentFixture<InterrogatePageComponent>;
  let configServiceStub: ConfigServiceStubSpec;

  beforeEach(async () => {
    configServiceStub = new ConfigServiceStubSpec();

    await TestBed.configureTestingModule({
      declarations: [ InterrogatePageComponent ],
      imports: [
        CoreTestingModule
      ],
      providers: [
        {provide: ConfigService, useValue: configServiceStub}
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    RightConsents.init({apiRoot: '', httpClient: () => new Observable()});
    fixture = TestBed.createComponent(InterrogatePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
