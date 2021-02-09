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
import { Directive, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import {
  CollectionPage,
  EntryRecord,
  ModelDataType,
  ModelEntryDto,
  ModelEntryStatus,
  ModelFilter,
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
import { CoreService } from '../../../../../core/services/core.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';

class SubjectRecordDataSource extends CollectionDatasource<EntryRecord, ModelFilter> {

  public records: RecordsMap = {};

  constructor(private modelsResource: ModelsResourceService) {
    super();
  }

  protected getPage(pageFilter: ModelFilter): Observable<CollectionPage<EntryRecord>> {
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
            active: entry.status === ModelEntryStatus.ACTIVE && activeVersion !== undefined,
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

  public filter: ModelFilter = {
    page: 0,
    size: 10,
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
    protected subjectsResource: SubjectsResourceService,
    protected coreService: CoreService,
    protected snackBar: MatSnackBar,
    protected translate: TranslateService
  ) { }

  ngOnInit(): void {
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

  action(element: any): void {
    if (!this.coreService.hasActiveBasicInfo) {
      this.snackBar.open(this.translate.instant('ALERT.NO_BASIC_INFO'));
      throw new Error('No basic info');
    }
  }

}
