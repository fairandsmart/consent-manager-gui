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

import { OperatorProcessingComponent } from './operator-processing.component';
import { ModelsResourceService } from '../../../../../core/http/models-resource.service';
import { SubjectsResourceService } from '../../../../../core/http/subjects-resource.service';
import { EMPTY } from 'rxjs';
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;
import { CoreTestingModule } from '../../../../../testing/core-testing-module.spec';

describe('OperatorProcessingComponent', () => {
  let component: OperatorProcessingComponent;
  let fixture: ComponentFixture<OperatorProcessingComponent>;
  let modelsResourceServiceSpy: SpyObj<ModelsResourceService>;
  let subjectsResourceServiceSpy: SpyObj<SubjectsResourceService>;

  beforeEach(waitForAsync(() => {
    modelsResourceServiceSpy = createSpyObj<ModelsResourceService>('ModelsResourceService', ['listEntries']);
    subjectsResourceServiceSpy = createSpyObj<SubjectsResourceService>('SubjectsResourceService', ['listSubjectRecords']);

    TestBed.configureTestingModule({
      declarations: [OperatorProcessingComponent],
      imports: [CoreTestingModule],
      providers: [
        {provide: ModelsResourceService, useValue: modelsResourceServiceSpy},
        {provide: SubjectsResourceService, useValue: subjectsResourceServiceSpy}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    modelsResourceServiceSpy.listEntries.and.returnValue(EMPTY);
    subjectsResourceServiceSpy.listSubjectRecords.and.returnValue(EMPTY);

    fixture = TestBed.createComponent(OperatorProcessingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
