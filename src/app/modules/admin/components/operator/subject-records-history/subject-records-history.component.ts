import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { CollectionDatasource } from '../../../utils/collection-datasource';
import {
  CollectionPage,
  RecordDto,
  RecordFilter
} from '../../../../../core/models/models';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SubjectRecordApplyChangesDialogData } from '../subject-record-apply-changes-dialog/subject-record-apply-changes-dialog.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';

class SubjectRecordsHistoryDataSource extends CollectionDatasource<RecordDto, RecordFilter> {

  constructor(private records: RecordDto[]) {
    super();
  }

  protected getPage(pageFilter: RecordFilter): Observable<CollectionPage<RecordDto>> {
    const startIndex = pageFilter.size * pageFilter.page;
    const page: CollectionPage<RecordDto> = {
      values: this.records.slice(startIndex, Math.min(startIndex + pageFilter.size, this.records.length)),
      page: pageFilter.page,
      pageSize: pageFilter.size,
      totalPages: Math.ceil(this.records.length / pageFilter.size),
      totalCount: this.records.length
    };
    return of(page);
  }

}

@Component({
  selector: 'cm-subject-records-history',
  templateUrl: './subject-records-history.component.html',
  styleUrls: ['./subject-records-history.component.scss']
})
export class SubjectRecordsHistoryComponent implements OnInit {

  @ViewChild(MatPaginator, {static: true})
  public paginator: MatPaginator;

  @ViewChild(MatSort, {static: true})
  public sort: MatSort;

  public dataSource: SubjectRecordsHistoryDataSource;

  public displayedColumns = [
    'creationTimestamp', 'value', 'collectionMethod'
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
              @Inject(MAT_DIALOG_DATA) public data: RecordDto[]) {
  }

  ngOnInit(): void {
    this.dataSource = new SubjectRecordsHistoryDataSource(this.data);
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

  close(): void {
    this.dialogRef.close();
  }
}
