import { Component, OnInit, ViewChild } from '@angular/core';
import {
  Record,
  RecordFilter
} from '../models';
import {
  ConsentsResourceService
} from '../consents-resource.service';
import { MatPaginator } from '@angular/material/paginator';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, Observable } from 'rxjs';
import { delay, finalize, tap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';

class RecordDataSource implements DataSource<Record> {

  private recordsSubject = new BehaviorSubject<Record[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  public loading$ = this.loadingSubject.asObservable();

  private _paginator: MatPaginator;

  constructor(private consentsResource: ConsentsResourceService) {
  }

  get paginator(): MatPaginator | null {
    return this._paginator;
  }

  set paginator(paginator: MatPaginator | null) {
    this._paginator = paginator;
  }

  connect(collectionViewer: CollectionViewer): Observable<Record[] | ReadonlyArray<Record>> {
    return this.recordsSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.recordsSubject.complete();
    this.loadingSubject.complete();
  }

  loadRecords(filter: RecordFilter): void {
    this.loadingSubject.next(true);
    this.consentsResource.listRecords(filter).pipe(
      finalize(() => this.loadingSubject.next(false))
    ).subscribe(response => {
      if (this._paginator != null) {
        this._paginator.length = response.totalCount;
      }
      this.recordsSubject.next(response.values);
    }, error => {
      console.error(error);
      this.recordsSubject.next([]);
    });
  }

}

@Component({
  selector: 'app-records',
  templateUrl: './records.component.html',
  styleUrls: ['./records.component.scss']
})
export class RecordsComponent implements OnInit {

  displayedColumns = ['id', 'serial', 'subject', 'value'];

  pageSizeOptions = [10, 25, 50];

  dataSource: RecordDataSource;

  filter: RecordFilter = {
    query: "",
    page: 0,
    size: 10
  };

  @ViewChild(MatPaginator, {static: true})
  paginator: MatPaginator;

  constructor(private consentsResource: ConsentsResourceService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.dataSource = new RecordDataSource(this.consentsResource);
    this.dataSource.paginator = this.paginator;
    this.paginator.page.pipe(
      tap((e) => {
        this.filter.size = e.pageSize;
        this.filter.page = e.pageIndex;
        this.loadRecordsPage();
      })
    ).subscribe();
    this.loadRecordsPage();
  }

  loadRecordsPage(): void {
    this.dataSource.loadRecords(this.filter);
  }

}
