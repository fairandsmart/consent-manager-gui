import { Component, OnInit, ViewChild } from '@angular/core';
import { CollectionDatasource } from '../../utils/collection-datasource';
import {
  CollectionMethod,
  CollectionPage,
  ConsentContext,
  ConsentFormOrientation,
  ConsentFormType, EntryRecord, EntryRecordFilter,
  ModelEntryDto,
  ModelVersionDtoLight,
  ModelVersionStatus,
  RecordDto
} from '../../../../core/models/models';
import { combineLatest, Observable } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { map, tap } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { SubjectRecordEditorDialogComponent } from '../../components/subject-record-editor-dialog/subject-record-editor-dialog.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModelsResourceService } from '../../../../core/http/models-resource.service';
import { TranslateService } from '@ngx-translate/core';
import { ConsentsResourceService } from '../../../../core/http/consents-resource.service';
import { SubjectsResourceService } from '../../../../core/http/subjects-resource.service';
import { HttpParams } from '@angular/common/http';

class SubjectRecordDataSource extends CollectionDatasource<EntryRecord, EntryRecordFilter> {

  constructor(private modelsResource: ModelsResourceService, private subjectsResource: SubjectsResourceService) {
    super();
  }

  protected getPage(pageFilter: EntryRecordFilter): Observable<CollectionPage<EntryRecord>> {
    return combineLatest([
      this.modelsResource.listEntries(pageFilter),
      this.subjectsResource.listCustomerRecords(pageFilter.subject)
    ]).pipe(
      map(([entries, records]: [CollectionPage<ModelEntryDto>, { [key: string]: RecordDto[] }]) => {
        const values = [];
        entries.values.forEach((entry) => {
          const activeVersion: ModelVersionDtoLight = entry.versions.find(v => v.status === ModelVersionStatus.ACTIVE);
          const result: EntryRecord = {
            identifier: activeVersion?.identifier,
            key: entry.key,
            name: entry.name,
            type: entry.type,
            active: activeVersion !== undefined
          };
          const recordsList = records[entry.key];
          if (recordsList && recordsList.length > 0) {
            const record = recordsList.pop();
            result.value = record.value;
            result.recordCreation = record.creationTimestamp;
            result.recordExpiration = record.expirationTimestamp;
            result.comment = record.comment;
            result.collectionMethod = record.collectionMethod;
            result.status = record.status;
          }
          values.push(result);
        });
        const collection: CollectionPage<EntryRecord> = {
          page: entries.page,
          pageSize: entries.pageSize,
          totalCount: entries.totalCount,
          totalPages: entries.totalPages,
          values: values
        };
        return collection;
      })
    );
  }

}

@Component({
  selector: 'app-subject-records',
  templateUrl: './subject-records.component.html',
  styleUrls: ['../../components/entry/entry-content/_entry-content.directive.scss', './subject-records.component.scss']
})
export class SubjectRecordsComponent implements OnInit {

  public displayedColumns = [
    'key', 'name', 'type', 'value', 'collectionMethod', 'comment', 'status', 'recordCreation', 'recordExpiration', 'actions'
  ];

  public pageSizeOptions = [10, 25, 50];

  public dataSource: SubjectRecordDataSource;

  public filter: EntryRecordFilter = {
    page: 0,
    size: 10,
    subject: undefined,
    before: -1,
    after: -1,
    order: 'key',
    direction: 'asc',
    types: ['treatment', 'preference', 'conditions']
  };

  @ViewChild(MatPaginator, {static: true})
  public paginator: MatPaginator;

  @ViewChild(MatSort, {static: true})
  public sort: MatSort;

  public operatorLog: EntryRecord[] = [];

  public form: FormGroup;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private modelsResource: ModelsResourceService,
    private subjectsResource: SubjectsResourceService,
    private consentsResource: ConsentsResourceService,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private translateService: TranslateService) {
  }

  ngOnInit(): void {
    this.dataSource = new SubjectRecordDataSource(this.modelsResource, this.subjectsResource);
    this.dataSource.paginator = this.paginator;
    this.route.paramMap.subscribe(params => {
      this.filter.subject = params.get('subject');
      this.reloadRecords();
    });
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
    this.form = this.fb.group({comment: ['', [Validators.required]]});
    this.form.enable();
  }

  reloadRecords(): void {
    if (this.filter.subject) {
      this.dataSource.loadPage(this.filter);
    }
  }

  addElementToLog(element): void {
    this.dialog.open<SubjectRecordEditorDialogComponent, EntryRecord>(SubjectRecordEditorDialogComponent, {
      data: element
    }).afterClosed().subscribe((result) => {
      if (result) {
        const previousIndex = this.operatorLog.findIndex(e => e.key === result.key);
        if (previousIndex < 0) {
          this.operatorLog.push(result);
        } else {
          this.operatorLog[previousIndex] = result;
        }
      }
    });
  }

  removeElementFromLog(element): void {
    const index = this.operatorLog.findIndex(e => e.key === element.key);
    if (index >= 0) {
      this.operatorLog.splice(index, 1);
    }
  }

  submitLog(): void {
    if (this.form.valid) {
      this.form.disable();

      const ctx: ConsentContext = {
        subject: this.filter.subject,
        orientation: ConsentFormOrientation.VERTICAL,
        header: '',
        elements: this.operatorLog.map(e => e.identifier),
        footer: '',
        callback: '',
        locale: this.translateService.currentLang,
        formType: ConsentFormType.FULL,
        receiptDeliveryType: 'STORE',
        userinfos: {},
        attributes: {},
        optoutModel: '',
        optoutRecipient: '',
        collectionMethod: CollectionMethod.OPERATOR,
        author: '',
        preview: false,
        iframe: true
      };

      this.consentsResource.generateToken(ctx).subscribe((token) => {
        const formValue = this.form.getRawValue();
        let values: HttpParams = new HttpParams().append('token', token).append('comment', formValue.comment);
        this.operatorLog.forEach(element => values = values.append(element.identifier, element.value));

        this.consentsResource.postConsent(values).subscribe((receipt) => {
          this.operatorLog = [];
          this.form.get('comment').setValue('');
          this.form.enable();
          this.reloadRecords();
        });
      });
    }
  }

}
