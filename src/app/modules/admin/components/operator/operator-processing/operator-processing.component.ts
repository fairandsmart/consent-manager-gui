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
import { OperatorConsentListDirective } from '../operator-consent-list/operator-consent-list.directive';
import { EntryRecord, RecordStatus } from '@fairandsmart/consents-ce/records';
import {
  SubjectRecordEditorDialogComponent,
  SubjectRecordEditorDialogData
} from '../subject-record-editor-dialog/subject-record-editor-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { SubjectRecordsHistoryComponent } from '../subject-records-history/subject-records-history.component';
import { CoreService } from '../../../../../core/services/core.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { Icons } from '../../../../../core/models/common';
import { getActiveVersion, Processing } from '@fairandsmart/consents-ce/models';
import { ConfigService } from '../../../../../core/services/config.service';

@Component({
  selector: 'cm-operator-processing',
  templateUrl: './operator-processing.component.html',
  styleUrls: ['../operator-consent-list/_operator-consent-list.directive.scss', './operator-processing.component.scss']
})
export class OperatorProcessingComponent extends OperatorConsentListDirective implements OnInit {

  readonly ICONS = Icons;
  private readonly defaultLanguage;

  public displayedColumns = ['key', 'name', 'collectionMethod', 'object', 'recordExpiration', 'status', 'actions'];
  public pageSizeOptions = [10, 25, 50];

  constructor(
    private dialog: MatDialog,
    protected coreService: CoreService,
    protected snackBar: MatSnackBar,
    protected translate: TranslateService,
    private configService: ConfigService
  ) {
    super(coreService, snackBar, translate);
    this.defaultLanguage = this.configService.getDefaultLanguage();
  }

  ngOnInit(): void {
    this.type = 'processing';
    super.ngOnInit();
  }

  edit(element: EntryRecord): void {
    if (!this.coreService.hasActiveInfo) {
      this.snackBar.open(this.translate.instant('ALERT.NO_INFORMATION'));
      throw new Error('No info');
    }

    getActiveVersion(element.id).subscribe((version) => {
      let versionDto: Processing;
      if (version.data[this.translate.currentLang]) {
        versionDto = version.data[this.translate.currentLang] as Processing;
      } else {
        versionDto = version.data[this.defaultLanguage] as Processing;
      }
      this.dialog.open<SubjectRecordEditorDialogComponent, SubjectRecordEditorDialogData>(SubjectRecordEditorDialogComponent, {
        data: {
          record: element,
          options: versionDto.refusable ? ['refused', 'accepted'] : ['accepted']
        }
      }).afterClosed().subscribe((result) => {
        this.operatorAction.emit(result);
      });
    });
  }

  showHistory(element: EntryRecord): void {
    this.dialog.open<SubjectRecordsHistoryComponent>(SubjectRecordsHistoryComponent, {
      data: {subject: this.subject, records: this.records[element.recordIdentifier]?.slice().reverse()}
    });
  }

  hasHistory(element: EntryRecord): boolean {
    return this.records[element.recordIdentifier]?.length > 0;
  }

  getRecordStatus(element: EntryRecord): string {
    return element.status === RecordStatus.VALID && element.value === 'accepted' ? 'VALID' : 'INVALID';
  }

}
