import { Directive, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { EntryRecordFilter, ModelDataType } from '../../../../../core/models/models';
import { SubjectRecordDataSource } from '../../../pages/subject-records/subject-records.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { ModelsResourceService } from '../../../../../core/http/models-resource.service';
import { SubjectsResourceService } from '../../../../../core/http/subjects-resource.service';
import { tap } from 'rxjs/operators';

@Directive({
  selector: '[cmOperatorConsentList]'
})
export abstract class OperatorConsentListDirective implements OnInit {

  public type: ModelDataType;

  @Input()
  public subject: string;

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
  operatorAction = new EventEmitter<{identifier: string; value: string}>();

  protected constructor(
    protected modelsResource: ModelsResourceService,
    protected subjectsResource: SubjectsResourceService
  ) { }

  ngOnInit(): void {
    this.filter.subject = this.subject;
    this.filter.types.push(this.type);
    this.dataSource = new SubjectRecordDataSource(this.modelsResource, this.subjectsResource);
    this.dataSource.paginator = this.paginator;
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
  }

  reloadRecords(): void {
    this.dataSource.loadPage(this.filter);
  }

}
