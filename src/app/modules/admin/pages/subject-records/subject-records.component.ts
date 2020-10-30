import { Component, OnInit, ViewChild } from '@angular/core';
import { CollectionDatasource } from '../../utils/collection-datasource';
import {
  CollectionMethod,
  CollectionPage,
  ConsentContext,
  ConsentFormOrientation,
  ConsentFormType,
  EntryRecord,
  EntryRecordFilter,
  Icons,
  ModelEntryDto,
  ModelVersionDtoLight,
  RecordDto
} from '../../../../core/models/models';
import { combineLatest, Observable } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { map, tap } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { SubjectRecordEditorDialogComponent } from '../../components/operator/subject-record-editor-dialog/subject-record-editor-dialog.component';
import { ModelsResourceService } from '../../../../core/http/models-resource.service';
import { TranslateService } from '@ngx-translate/core';
import { ConsentsResourceService } from '../../../../core/http/consents-resource.service';
import { SubjectsResourceService } from '../../../../core/http/subjects-resource.service';
import { HttpParams } from '@angular/common/http';
import * as _ from 'lodash';
import {
  SubjectRecordApplyChangesDialogComponent,
  SubjectRecordApplyChangesDialogData
} from '../../components/operator/subject-record-apply-changes-dialog/subject-record-apply-changes-dialog.component';
import { getActiveVersion } from '../../../../core/utils/model-entry.utils';

export class SubjectRecordDataSource extends CollectionDatasource<EntryRecord, EntryRecordFilter> {

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
          const activeVersion: ModelVersionDtoLight = getActiveVersion(entry);
          const result: EntryRecord = {
            identifier: activeVersion?.identifier,
            key: entry.key,
            name: entry.name,
            type: entry.type,
            active: activeVersion !== undefined
          };
          const recordsList = records[entry.key];
          if (recordsList && recordsList.length > 0) {
            const record = _.last(recordsList);
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

// TODO delete component
@Component({
  selector: 'cm-subject-records',
  templateUrl: './subject-records.component.html',
  styleUrls: ['../../components/entry/entry-content/_entry-content.directive.scss', './subject-records.component.scss']
})
export class SubjectRecordsComponent implements OnInit {

  readonly ICONS = Icons;
  public displayedColumns = [
    'key', 'name', 'type', 'value', 'collectionMethod', 'comment', 'status', 'recordCreation', 'recordExpiration', 'actions'
  ];
  public pageSizeOptions = [10, 25, 50];

  public subject: string;
  public consentsDataSource: SubjectRecordDataSource;

  public consentsFilter: EntryRecordFilter = {
    page: 0,
    size: 10,
    subject: undefined,
    before: -1,
    after: -1,
    order: 'key',
    direction: 'asc',
    types: ['conditions', 'processing']
  };

  public preferencesFilter: EntryRecordFilter = {
    page: 0,
    size: 10,
    subject: undefined,
    before: -1,
    after: -1,
    order: 'key',
    direction: 'asc',
    types: ['preference']
  };

  @ViewChild(MatPaginator, {static: true})
  public paginator: MatPaginator;

  @ViewChild(MatSort, {static: true})
  public sort: MatSort;

  public operatorLog: EntryRecord[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private modelsResource: ModelsResourceService,
    private subjectsResource: SubjectsResourceService,
    private consentsResource: ConsentsResourceService,
    private dialog: MatDialog,
    private translateService: TranslateService) {
  }

  ngOnInit(): void {
    this.consentsDataSource = new SubjectRecordDataSource(this.modelsResource, this.subjectsResource);
    this.consentsDataSource.paginator = this.paginator;
    this.route.paramMap.subscribe(params => {
      this.subject = params.get('subject');
      this.consentsFilter.subject = this.subject;
      this.preferencesFilter.subject = this.subject;
      this.reloadRecords();
    });
    this.sort.sortChange.subscribe((sort: Sort) => {
      this.consentsFilter.page = 0;
      this.consentsFilter.order = sort.active;
      this.consentsFilter.direction = sort.direction;
      this.reloadRecords();
    });
    this.paginator.page.pipe(
      tap((e) => {
        this.consentsFilter.size = e.pageSize;
        this.consentsFilter.page = e.pageIndex;
        this.reloadRecords();
      })
    ).subscribe();
  }

  reloadRecords(): void {
    if (this.consentsFilter.subject) {
      this.consentsDataSource.loadPage(this.consentsFilter);
    }
  }

  addElementToLog(element): void {
    this.dialog.open<SubjectRecordEditorDialogComponent, EntryRecord>(SubjectRecordEditorDialogComponent, {
      data: element
    }).afterClosed().subscribe((result: EntryRecord) => {
      if (result) {
        const index = this.operatorLog.findIndex(e => e.key === result.key);
        if (index < 0) {
          this.operatorLog.push(result);
        } else {
          this.operatorLog[index] = result;
        }
      }
    });
  }

  removeElementFromLog(index): void {
    this.operatorLog.splice(index, 1);
  }

  submitLog(): void {
    this.dialog.open<SubjectRecordApplyChangesDialogComponent, SubjectRecordApplyChangesDialogData>(
      SubjectRecordApplyChangesDialogComponent,
      {data: {recipient: '', model: '', comment: ''}})
      .afterClosed().subscribe((result) => {
      if (result) {
        const ctx: ConsentContext = {
          subject: this.consentsFilter.subject,
          orientation: ConsentFormOrientation.VERTICAL,
          info: '',
          elements: this.operatorLog.map(e => e.identifier),
          callback: '',
          locale: this.translateService.currentLang,
          formType: ConsentFormType.FULL,
          receiptDeliveryType: 'DOWNLOAD',
          userinfos: {},
          attributes: {},
          notificationModel: result.model,
          notificationRecipient: result.recipient,
          collectionMethod: CollectionMethod.OPERATOR,
          author: '',
          preview: false,
          iframe: true
        };

        this.consentsResource.generateToken(ctx).subscribe((token) => {
          let values: HttpParams = new HttpParams().append('token', token).append('comment', result.comment);
          this.operatorLog.forEach(element => values = values.append(element.identifier, element.value));

          this.consentsResource.postConsent(values).subscribe((receipt) => {
            this.operatorLog = [];
            this.reloadRecords();
          });
        });
      }
    });
  }

}
