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

import { SubjectRecordsHistoryComponent } from './subject-records-history.component';
import { CoreTestingModule } from '../../../../../testing/core-testing-module.spec';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;
import { EMPTY } from 'rxjs';

describe('SubjectRecordsHistoryComponent', () => {
  let component: SubjectRecordsHistoryComponent;
  let fixture: ComponentFixture<SubjectRecordsHistoryComponent>;
  let dialogRefSpy: SpyObj<MatDialogRef<SubjectRecordsHistoryComponent>>;

  beforeEach(waitForAsync(() => {
    dialogRefSpy = createSpyObj<MatDialogRef<SubjectRecordsHistoryComponent>>('MatDialogRef', ['close']);

    TestBed.configureTestingModule({
      declarations: [SubjectRecordsHistoryComponent],
      imports: [CoreTestingModule],
      providers: [
        {provide: MatDialogRef, useValue: dialogRefSpy},
        {provide: MAT_DIALOG_DATA, useValue: []},
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubjectRecordsHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
