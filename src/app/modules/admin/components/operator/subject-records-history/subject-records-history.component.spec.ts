import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SubjectRecordsHistoryComponent } from './subject-records-history.component';
import { CoreTestingModule } from '../../../../../testing/core-testing-module.spec';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;
import { ReceiptsResourceService } from '../../../../../core/http/receipts-resource.service';
import { EMPTY } from 'rxjs';

describe('SubjectRecordsHistoryComponent', () => {
  let component: SubjectRecordsHistoryComponent;
  let fixture: ComponentFixture<SubjectRecordsHistoryComponent>;
  let dialogRefSpy: SpyObj<MatDialogRef<SubjectRecordsHistoryComponent>>;
  let receiptsResourceServiceSpy: SpyObj<ReceiptsResourceService>;

  beforeEach(waitForAsync(() => {
    dialogRefSpy = createSpyObj<MatDialogRef<SubjectRecordsHistoryComponent>>('MatDialogRef', ['close']);
    receiptsResourceServiceSpy = createSpyObj<ReceiptsResourceService>('ReceiptsResourceService', ['getReceiptPdf']);

    TestBed.configureTestingModule({
      declarations: [ SubjectRecordsHistoryComponent ],
      imports: [ CoreTestingModule ],
      providers: [
        {provide: MatDialogRef, useValue: dialogRefSpy},
        {provide: MAT_DIALOG_DATA, useValue: []},
        {provide: ReceiptsResourceService, useValue: receiptsResourceServiceSpy},
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    receiptsResourceServiceSpy.getReceiptPdf.and.returnValue(EMPTY);

    fixture = TestBed.createComponent(SubjectRecordsHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
