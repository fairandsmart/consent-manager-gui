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
  listEntries,
  ModelDataType,
  ModelEntryDto,
  ModelEntryStatus,
  ModelFilter,
  ModelVersionDtoLight,
  ModelVersionStatus,
} from '@fairandsmart/consents-ce/models';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { map, tap } from 'rxjs/operators';
import { CollectionDatasource } from '../../../utils/collection-datasource';
import { Observable, Subject } from 'rxjs';
import * as _ from 'lodash';
import { CoreService } from '../../../../../core/services/core.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import {
  EntryRecord,
  OperatorLogElement,
  RECORD_IDENTIFIER_DEFAULT,
  RECORD_IDENTIFIER_SEPARATOR,
  RecordsMap
} from '@fairandsmart/consents-ce/records';
import { CollectionPage } from '@fairandsmart/consents-ce';

class SubjectRecordDataSource extends CollectionDatasource<EntryRecord, ModelFilter> {

  public records: RecordsMap = {};

  constructor(public subject: string) {
    super();
  }

  private initEntryRecord(entry: ModelEntryDto, activeVersion: ModelVersionDtoLight): EntryRecord {
    return {
      id: entry.id,
      key: entry.key,
      subject: this.subject,
      recordIdentifier: entry.key + RECORD_IDENTIFIER_SEPARATOR + this.subject + RECORD_IDENTIFIER_SEPARATOR + RECORD_IDENTIFIER_DEFAULT,
      type: entry.type,
      name: entry.name,
      identifier: activeVersion?.identifier,
      active: entry.status === ModelEntryStatus.ACTIVE && activeVersion !== undefined,
      versionIndex: activeVersion !== undefined ? entry.versions.indexOf(activeVersion) + 1 : undefined
    };
  }

  protected getPage(pageFilter: ModelFilter): Observable<CollectionPage<EntryRecord>> {
    return listEntries(pageFilter).pipe(
      map((entries: CollectionPage<ModelEntryDto>) => {
        const values: EntryRecord[] = [];
        entries.values.forEach((entry) => {
          const activeVersion: ModelVersionDtoLight = entry.versions.find(v => v.status === ModelVersionStatus.ACTIVE);
          const recordsKeys = Object.keys(this.records).filter(key => key.startsWith(entry.key + RECORD_IDENTIFIER_SEPARATOR));
          if (recordsKeys.length > 0) {
            recordsKeys.forEach(recordKey => {
              const recordsList = this.records[recordKey];
              if (recordsList && recordsList.length > 0) {
                const record = _.last(recordsList);
                const result: EntryRecord = this.initEntryRecord(entry, activeVersion);
                result.object = recordKey.split(RECORD_IDENTIFIER_SEPARATOR)[2];
                result.recordIdentifier = recordKey;
                result.value = record.value;
                result.recordCreation = record.creationTimestamp;
                result.recordExpiration = record.expirationTimestamp;
                result.comment = record.comment;
                result.origin = record.origin;
                result.status = record.status;
                values.push(result);
              }
            });
          } else {
            values.push(this.initEntryRecord(entry, activeVersion));
          }
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
    protected coreService: CoreService,
    protected snackBar: MatSnackBar,
    protected translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.filter.types.push(this.type);
    this.dataSource = new SubjectRecordDataSource(this.subject);
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

  preventDefaultAndPropagation($event: MouseEvent): void {
    $event.preventDefault();
    $event.stopPropagation();
  }
}
