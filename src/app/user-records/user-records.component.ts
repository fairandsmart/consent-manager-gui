import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CollectionPage, UserRecord, UserRecordFilter } from '../models';
import { ConsentsResourceService } from '../consents-resource.service';
import { MatPaginator } from '@angular/material/paginator';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MatSort, Sort } from '@angular/material/sort';
import { CollectionDatasource } from '../common/collection-datasource';
import { MatDialog } from '@angular/material/dialog';
import { UserRecordEditorDialogComponent, UserRecordEditorDialogComponentData } from '../user-record-editor-dialog/user-record-editor-dialog.component';
import { KeycloakService } from 'keycloak-angular';

class UserRecordDataSource extends CollectionDatasource<UserRecord, UserRecordFilter> {

  constructor(private consentsResource: ConsentsResourceService) {
    super();
  }

  protected getPage(pageFilter: UserRecordFilter): Observable<CollectionPage<UserRecord>> {
    return this.consentsResource.listUserRecords(pageFilter);
  }

}

@Component({
  selector: 'app-user-records',
  templateUrl: './user-records.component.html',
  styleUrls: ['./user-records.component.scss']
})
export class UserRecordsComponent implements OnInit {

  displayedColumns = ['bodyKey', 'type', 'value', 'status', 'creationTimestamp', 'expirationTimestamp', 'actions'];

  pageSizeOptions = [10, 25, 50];

  dataSource: UserRecordDataSource;

  filter: UserRecordFilter = {
    user: "",
    page: 0,
    size: 10,
    order: 'key',
    direction: 'asc'
  };

  @ViewChild(MatPaginator, {static: true})
  paginator: MatPaginator;

  @ViewChild(MatSort, {static: true})
  sort: MatSort;

  constructor(
    private activatedRoute: ActivatedRoute,
    private consentsResource: ConsentsResourceService,
    private dialog: MatDialog,
    public keycloak: KeycloakService) {}

  ngOnInit(): void {
    this.dataSource = new UserRecordDataSource(this.consentsResource);
    this.dataSource.paginator = this.paginator;
    this.activatedRoute.paramMap.subscribe(params => {
      this.filter.user = params.get('user');
      this.loadUserRecordsPage();
    });
    this.sort.sortChange.subscribe((sort: Sort) => {
      this.filter.page = 0;
      this.filter.order = sort.active;
      this.filter.direction = sort.direction;
      this.loadUserRecordsPage();
    });
    this.paginator.page.pipe(
      tap((e) => {
        this.filter.size = e.pageSize;
        this.filter.page = e.pageIndex;
        this.loadUserRecordsPage();
      })
    ).subscribe();
  }

  loadUserRecordsPage(): void {
    this.dataSource.loadPage(this.filter);
  }

  editRecord(record: UserRecord, $event: MouseEvent): void {
    $event.preventDefault();
    $event.stopPropagation();
    this.dialog.open<UserRecordEditorDialogComponent, UserRecordEditorDialogComponentData>(UserRecordEditorDialogComponent, {
      data: {
        record: record,
        owner: this.keycloak.getUsername(),
        subject: this.filter.user
      }
    }).afterClosed().subscribe((updatedRecord) => {
      if (updatedRecord != null) {
        this.filter.page = 0;
        this.loadUserRecordsPage();
      }
    });
  }

}
