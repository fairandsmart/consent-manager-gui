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
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { CollectionDatasource } from '../../../utils/collection-datasource';
import {
  NotificationReport,
  NotificationReportType,
  RecordDto,
  RecordFilter,
  RecordStatus
} from '@fairandsmart/consent-manager/records';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SubjectRecordApplyChangesDialogData } from '../subject-record-apply-changes-dialog/subject-record-apply-changes-dialog.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import * as FileSaver from 'file-saver';
import { CollectionPage } from '@fairandsmart/consent-manager';
import { getReceiptPdf } from '@fairandsmart/consent-manager/receipts';

class SubjectRecordsHistoryDataSource extends CollectionDatasource<RecordDto, RecordFilter> {

  constructor(private records: RecordDto[]) {
    super();
  }

  protected getPage(pageFilter: RecordFilter): Observable<CollectionPage<RecordDto>> {
    let page: CollectionPage<RecordDto>;
    if (this.records !== undefined) {
      const startIndex = Math.min(pageFilter.size * pageFilter.page, this.records.length);
      page = {
        values: this.records.slice(startIndex, Math.min(startIndex + pageFilter.size, this.records.length)),
        page: pageFilter.page,
        pageSize: pageFilter.size,
        totalPages: Math.ceil(this.records.length / pageFilter.size),
        totalCount: this.records.length
      };
    } else {
      page = {
        values: [],
        page: 0,
        pageSize: 10,
        totalPages: 0,
        totalCount: 0
      };
    }
    return of(page);
  }

}

@Component({
  selector: 'cm-subject-records-history',
  templateUrl: './subject-records-history.component.html',
  styleUrls: ['../operator-consent-list/_operator-consent-list.directive.scss', './subject-records-history.component.scss']
})
export class SubjectRecordsHistoryComponent implements OnInit {

  readonly NOTIFICATION_CHANNELS = Object.keys(NotificationReportType);

  @ViewChild(MatPaginator, {static: true})
  public paginator: MatPaginator;

  @ViewChild(MatSort, {static: true})
  public sort: MatSort;

  public dataSource: SubjectRecordsHistoryDataSource;

  public displayedColumns = [
    'creationTimestamp', 'value', 'collectionMethod', 'status', 'statusDetails', 'notificationReports', 'receipt'
  ];
  public pageSizeOptions = [10, 25, 50];

  public filter: RecordFilter = {
    page: 0,
    size: 10,
    before: -1,
    after: -1,
    order: 'creationTimestamp',
    direction: 'desc'
  };

  constructor(private dialogRef: MatDialogRef<SubjectRecordsHistoryComponent, SubjectRecordApplyChangesDialogData>,
              @Inject(MAT_DIALOG_DATA) public data: {subject: string, records: RecordDto[]}) {
  }

  ngOnInit(): void {
    this.dataSource = new SubjectRecordsHistoryDataSource(this.data.records);
    this.dataSource.paginator = this.paginator;
    this.sort.sortChange.subscribe((sort: Sort) => {
      this.filter.page = 0;
      this.filter.order = sort.active;
      this.filter.direction = sort.direction;
      this.reloadRecords();
    });
    this.paginator.page.pipe(
      tap((e) => {
        this.filter.size = e.pageSize;
        this.filter.page = e.pageIndex;
        this.reloadRecords();
      })
    ).subscribe();
    this.reloadRecords();
  }

  reloadRecords(): void {
    this.dataSource.loadPage(this.filter);
  }

  formatValue(value): string {
    return value ? value.split(',').join(' ; ') : '-';
  }

  getRecordStatus(element): string {
    return element.status === RecordStatus.VALID && element.value === 'accepted' ? 'VALID' : 'INVALID';
  }

  filterNotificationReports(allReports: NotificationReport[]): NotificationReport[] {
    const currentReports: NotificationReport[] = [];
    this.NOTIFICATION_CHANNELS.forEach((channel) => {
      const reports = allReports.filter((report) => report.type === channel);
      if (reports.length > 0) {
        currentReports.push(reports.pop());
      }
    });
    return currentReports;
  }

  openReceipt(element): void {
    getReceiptPdf(element.transaction, '').pipe(
      tap((pdf: ArrayBuffer) => {
        const blob = new Blob([pdf], {type: 'application/pdf'});
        FileSaver.saveAs(blob, 'receipt.pdf');
      }),
      catchError((response) => {
        console.error(response);
        return null;
      })
    ).subscribe();
  }

  close(): void {
    this.dialogRef.close();
  }
}
