import { Component, OnInit, ViewChild } from '@angular/core';
import { CollectionPage, Record, RecordFilter } from '../models';
import { MatPaginator } from '@angular/material/paginator';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MatSort, Sort } from '@angular/material/sort';
import { CollectionDatasource } from '../common/collection-datasource';
import { ActivatedRoute, Router } from '@angular/router';
import { RecordsResourceService } from '../records-resource.service';

class RecordDataSource extends CollectionDatasource<Record, RecordFilter> {

  constructor(private recordsResource: RecordsResourceService) {
    super();
  }

  protected getPage(pageFilter: RecordFilter): Observable<CollectionPage<Record>> {
    return this.recordsResource.listRecords(pageFilter);
  }

}

@Component({
  selector: 'app-records',
  templateUrl: './records.component.html',
  styleUrls: ['./records.component.scss']
})
export class RecordsComponent implements OnInit {

  displayedColumns = ['bodyKey', 'type', 'subject', 'value', 'collectionMethod', 'status', 'creationTimestamp', 'expirationTimestamp'];

  pageSizeOptions = [10, 25, 50];

  dataSource: RecordDataSource;

  filter: RecordFilter = {
    query: '',
    page: 0,
    size: 10,
    order: 'creationTimestamp',
    direction: 'desc'
  };

  @ViewChild(MatPaginator, {static: true})
  paginator: MatPaginator;

  @ViewChild(MatSort, {static: true})
  sort: MatSort;

  constructor(
      private router: Router,
      private route: ActivatedRoute,
      private recordsResource: RecordsResourceService) {}

  ngOnInit(): void {
    this.dataSource = new RecordDataSource(this.recordsResource);
    this.dataSource.paginator = this.paginator;
    this.sort.sortChange.subscribe((sort: Sort) => {
      this.filter.page = 0;
      this.filter.order = sort.active as keyof Record;
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
    this.router.navigate(['./' + this.filter.query], { relativeTo: this.route });
  }
}
