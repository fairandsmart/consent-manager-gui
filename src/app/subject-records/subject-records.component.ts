import { Component, OnInit, ViewChild } from '@angular/core';
import { CollectionDatasource } from '../common/collection-datasource';
import { CollectionPage, Record, RecordFilter } from '../models';
import { RecordsResourceService } from '../records-resource.service';
import { Observable } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { tap } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { ConsentsResourceService } from '../consents-resource.service';
import { MatDialog } from '@angular/material/dialog';
import { SubjectRecordEditorDialogComponent } from '../subject-record-editor-dialog/subject-record-editor-dialog.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

class SubjectRecordDataSource extends CollectionDatasource<Record, RecordFilter> {

  constructor(private recordsResource: RecordsResourceService) {
    super();
  }

  protected getPage(pageFilter: RecordFilter): Observable<CollectionPage<Record>> {
    return this.recordsResource.listRecords(pageFilter);
  }

}

@Component({
  selector: 'app-subject-records',
  templateUrl: './subject-records.component.html',
  styleUrls: ['../entry-content/_entry-content.directive.scss', './subject-records.component.scss']
})
export class SubjectRecordsComponent implements OnInit {

  public displayedColumns = ['bodyKey', 'type', 'value', 'collectionMethod', 'comment', 'creationTimestamp', 'expirationTimestamp', 'actions'];

  public pageSizeOptions = [10, 25, 50];

  public dataSource: SubjectRecordDataSource;

  public filter: RecordFilter = {
    page: 0,
    size: 10,
    subject: undefined,
    before: -1,
    after: -1,
    order: 'bodyKey',
    direction: 'asc'
  };

  @ViewChild(MatPaginator, {static: true})
  public paginator: MatPaginator;

  @ViewChild(MatSort, {static: true})
  public sort: MatSort;

  public operatorLog: Record[] = [];

  public form: FormGroup;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private consentsResource: ConsentsResourceService,
    private recordsResource: RecordsResourceService,
    private dialog: MatDialog,
    private fb: FormBuilder) {}

  ngOnInit(): void {
    this.dataSource = new SubjectRecordDataSource(this.recordsResource);
    this.dataSource.paginator = this.paginator;
    this.route.paramMap.subscribe(params => {
      this.filter.subject = params.get('subject');
      this.loadSubjectRecordsPage();
    });
    this.sort.sortChange.subscribe((sort: Sort) => {
      this.filter.page = 0;
      this.filter.order = sort.active;
      this.filter.direction = sort.direction;
      this.loadSubjectRecordsPage();
    });
    this.paginator.page.pipe(
      tap((e) => {
        this.filter.size = e.pageSize;
        this.filter.page = e.pageIndex;
        this.loadSubjectRecordsPage();
      })
    ).subscribe();
    this.form = this.fb.group({
      comment: ['', [
        Validators.required
      ]]
    });
    this.form.enable();
  }

  loadSubjectRecordsPage(): void {
    if (this.filter.subject) {
      this.dataSource.loadPage(this.filter);
    }
  }

  addElementToLog(element): void {
    this.dialog.open<SubjectRecordEditorDialogComponent, Record>(SubjectRecordEditorDialogComponent, {
      data: element
    }).afterClosed().subscribe((result) => {
      if (result) {
        const previousIndex = this.operatorLog.findIndex(e => e.bodyKey === result.bodyKey);
        if (previousIndex < 0) {
          this.operatorLog.push(result);
        } else {
          this.operatorLog[previousIndex] = result;
        }
      }
    });
  }

  removeElementFromLog(element): void {
    const index = this.operatorLog.findIndex(e => e.bodyKey === element.bodyKey);
    if (index >= 0) {
      this.operatorLog.splice(index, 1);
    }
  }

  submitLog(): void {
    if (this.form.valid) {
      this.form.disable();
      const formValue = this.form.getRawValue();
    }
  }

}
