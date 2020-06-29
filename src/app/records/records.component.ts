import { Component, OnInit, ViewChild } from '@angular/core';
import { CollectionPage, Record, RecordFilter } from '../models';
import { ConsentsResourceService } from '../consents-resource.service';
import { MatPaginator } from '@angular/material/paginator';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MatSort, Sort } from '@angular/material/sort';
import { CollectionDatasource } from '../common/collection-datasource';
import { ActivatedRoute, Router } from '@angular/router';

class RecordDataSource extends CollectionDatasource<Record, RecordFilter> {

  constructor(private consentsResource: ConsentsResourceService) {
    super();
  }

  protected getPage(pageFilter: RecordFilter): Observable<CollectionPage<Record>> {
    return this.consentsResource.listRecords(pageFilter);
  }

}

@Component({
  selector: 'app-records',
  templateUrl: './records.component.html',
  styleUrls: ['./records.component.scss']
})
export class RecordsComponent implements OnInit {

  displayedColumns = ['id', 'headKey', 'bodyKey', 'footKey', 'subject', 'type', 'value', 'collectionMethod', 'creationTimestamp', 'expirationTimestamp'];

  pageSizeOptions = [10, 25, 50];

  dataSource: RecordDataSource;

  filter: RecordFilter = {
    query: '',
    page: 0,
    size: 10,
    order: 'creationTimestamp',
    direction: 'asc'
  };

  @ViewChild(MatPaginator, {static: true})
  paginator: MatPaginator;

  @ViewChild(MatSort, {static: true})
  sort: MatSort;

  constructor(
      private router: Router,
      private activatedRoute: ActivatedRoute,
      private consentsResource: ConsentsResourceService) {}

  ngOnInit(): void {
    this.dataSource = new RecordDataSource(this.consentsResource);
    this.dataSource.paginator = this.paginator;
    this.sort.sortChange.subscribe((sort: Sort) => {
      this.filter.page = 0;
      this.filter.order = sort.active;
      this.filter.direction = sort.direction;
      this.loadRecordsPage();
    });
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
    this.dataSource.loadPage(this.filter);
  }

  submitSearch(): void {
    this.filter.page = 0;
    this.loadRecordsPage();
  }

  goToUserRecords(): void {
    this.router.navigate(['./' + this.filter.query], { relativeTo: this.activatedRoute });
  }
}