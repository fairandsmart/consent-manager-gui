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
import { Component, OnInit } from '@angular/core';
import { ModelsResourceService } from '../../../../../core/http/models-resource.service';
import { SubjectsResourceService } from '../../../../../core/http/subjects-resource.service';
import { OperatorConsentListDirective } from '../operator-consent-list/operator-consent-list.directive';
import { EntryRecord, Icons, RecordStatus } from '../../../../../core/models/models';
import {
  SubjectRecordEditorDialogComponent,
  SubjectRecordEditorDialogData
} from '../subject-record-editor-dialog/subject-record-editor-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { SubjectRecordsHistoryComponent } from '../subject-records-history/subject-records-history.component';

@Component({
  selector: 'cm-operator-processing',
  templateUrl: './operator-processing.component.html',
  styleUrls: ['../operator-consent-list/_operator-consent-list.directive.scss', './operator-processing.component.scss']
})
export class OperatorProcessingComponent extends OperatorConsentListDirective implements OnInit {

  readonly ICONS = Icons;
  public displayedColumns = [
    'key', 'name', 'collectionMethod', 'recordExpiration', 'history', 'status', 'actions'
  ];
  public pageSizeOptions = [10, 25, 50];

  constructor(
    protected modelsResource: ModelsResourceService,
    protected subjectsResource: SubjectsResourceService,
    private dialog: MatDialog
  ) {
    super(modelsResource, subjectsResource);
  }

  ngOnInit(): void {
    this.type = 'processing';
    super.ngOnInit();
  }

  action(element: EntryRecord): void {
    this.dialog.open<SubjectRecordEditorDialogComponent, SubjectRecordEditorDialogData>(SubjectRecordEditorDialogComponent, {
      data: {
        record: element,
        options: ['refused', 'accepted']
      }
    }).afterClosed().subscribe((result) => {
      this.operatorAction.emit(result);
    });
  }

  showHistory(element): void {
    this.dialog.open<SubjectRecordsHistoryComponent>(SubjectRecordsHistoryComponent, {
      data: {subject: this.subject, records: this.records[element.key]?.slice().reverse()}
    });
  }

  getRecordStatus(element): string {
    return element.status === RecordStatus.VALID && element.value === 'accepted' ? 'VALID' : 'INVALID';
  }

}
