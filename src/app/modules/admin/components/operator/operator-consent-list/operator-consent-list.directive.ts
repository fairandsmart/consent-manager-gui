import { Directive, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import {
  CollectionPage,
  EntryRecord,
  EntryRecordFilter,
  ModelDataType,
  ModelEntryDto,
  ModelVersionDtoLight,
  ModelVersionStatus,
  OperatorLogElement,
  RecordsMap
} from '../../../../../core/models/models';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { ModelsResourceService } from '../../../../../core/http/models-resource.service';
import { SubjectsResourceService } from '../../../../../core/http/subjects-resource.service';
import { map, tap } from 'rxjs/operators';
import { CollectionDatasource } from '../../../utils/collection-datasource';
import { Observable, Subject } from 'rxjs';
import * as _ from 'lodash';

class SubjectRecordDataSource extends CollectionDatasource<EntryRecord, EntryRecordFilter> {

  public records: RecordsMap = {};

  constructor(private modelsResource: ModelsResourceService) {
    super();
  }

  protected getPage(pageFilter: EntryRecordFilter): Observable<CollectionPage<EntryRecord>> {
    return this.modelsResource.listEntries(pageFilter).pipe(
      map((entries: CollectionPage<ModelEntryDto>) => {
        const values = [];
        entries.values.forEach((entry) => {
          const activeVersion: ModelVersionDtoLight = entry.versions.find(v => v.status === ModelVersionStatus.ACTIVE);
          const result: EntryRecord = {
            id: entry.id,
            key: entry.key,
            type: entry.type,
            name: entry.name,
            identifier: activeVersion?.identifier,
            active: activeVersion !== undefined,
            versionIndex: activeVersion !== undefined ? entry.versions.indexOf(activeVersion) + 1 : undefined
          };
          const recordsList = this.records[entry.key];
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

@Directive({
  selector: '[cmOperatorConsentList]'
})
export abstract class OperatorConsentListDirective implements OnInit {

  public type: ModelDataType;

  @Input()
  public subject: string;

  public records: RecordsMap = {};
  public recordsSubject: Subject<RecordsMap> = new Subject<RecordsMap>();
  public recordsObservable: Observable<RecordsMap> = this.recordsSubject.asObservable();

  public filter: EntryRecordFilter = {
    page: 0,
    size: 10,
    subject: undefined,
    before: -1,
    after: -1,
    order: 'key',
    direction: 'asc',
    types: []
  };

  public dataSource: SubjectRecordDataSource;

  @ViewChild(MatPaginator, {static: true})
  public paginator: MatPaginator;

  @ViewChild(MatSort, {static: true})
  public sort: MatSort;

  @Output()
  operatorAction = new EventEmitter<OperatorLogElement>();

  protected constructor(
    protected modelsResource: ModelsResourceService,
    protected subjectsResource: SubjectsResourceService
  ) { }

  ngOnInit(): void {
    this.filter.subject = this.subject;
    this.filter.types.push(this.type);
    this.dataSource = new SubjectRecordDataSource(this.modelsResource);
    this.dataSource.paginator = this.paginator;
    this.recordsObservable.subscribe((newRecords) => {
      this.dataSource.records = newRecords;
    });
    this.sort.sortChange.subscribe((sort: Sort) => {
      this.filter.page = 0;
      this.filter.order = sort.active;
      this.filter.direction = sort.direction;
      this.reloadData();
    });
    this.paginator.page.pipe(
      tap((e) => {
        this.filter.size = e.pageSize;
        this.filter.page = e.pageIndex;
        this.reloadData();
      })
    ).subscribe();
    this.reloadData();
  }

  reloadData(): void {
    this.dataSource.loadPage(this.filter);
  }

  updateRecords(records: RecordsMap): void {
    this.records = records;
    this.recordsSubject.next(records);
    this.reloadData();
  }

}