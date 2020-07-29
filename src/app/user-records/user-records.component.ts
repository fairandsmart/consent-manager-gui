import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  CollectionPage,
  UserRecord,
  UserRecordFilter,
  ModelEntry,
  ModelDataType,
  ModelFilter,
  OperatorRecordDto,
  OperatorRecordElement,
  ConsentContext,
  ConsentFormOrientation,
  ConsentFormType,
  CollectionMethod
} from '../models';
import { ConsentsResourceService } from '../consents-resource.service';
import { MatPaginator } from '@angular/material/paginator';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MatSort, Sort } from '@angular/material/sort';
import { CollectionDatasource } from '../common/collection-datasource';
import { MatDialog } from '@angular/material/dialog';
import { UserRecordEditorDialogComponent } from '../user-record-editor-dialog/user-record-editor-dialog.component';
import { ModelsResourceService } from '../models-resource.service';
import { KeycloakService } from 'keycloak-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LANGUAGES } from '../common/constants';

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
  styleUrls: ['../entry-content/_entry-content.directive.scss', './user-records.component.scss']
})
export class UserRecordsComponent implements OnInit {

  readonly LANGUAGES = LANGUAGES;

  public displayedColumns = ['bodyKey', 'value', 'collectionMethod', 'type', 'comment', 'creationTimestamp', 'expirationTimestamp', 'actions'];

  public pageSizeOptions = [10, 25, 50];

  public dataSource: UserRecordDataSource;

  public filter: UserRecordFilter = {
    user: '',
    page: 0,
    size: 10,
    order: 'key',
    direction: 'asc'
  };

  public displayOperatorForm = false;

  @ViewChild(MatPaginator, {static: true})
  public paginator: MatPaginator;

  @ViewChild(MatSort, {static: true})
  public sort: MatSort;

  public headers: ModelEntry[] = [];
  public footers: ModelEntry[] = [];

  public form: FormGroup;

  public operatorRecordsElements: OperatorRecordElement[] = [];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private consentsResource: ConsentsResourceService,
    private dialog: MatDialog,
    private modelsResource: ModelsResourceService,
    private keycloak: KeycloakService,
    private fb: FormBuilder) {}

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

    this.form = this.fb.group({
      locale: ['', [
        Validators.required
      ]],
      headerKey: ['', [
        Validators.required
      ]],
      footerKey: ['', [
        Validators.required
      ]],
      comment: ['', [
        Validators.required
      ]]
    });
    this.form.enable();

    this.loadEntries('header').subscribe((headers) => {
      this.headers = headers.values;
      if (this.headers.length > 0) {
        this.form.setValue({ headerKey: this.headers[0].key });
      }
    }, (err) => {
      console.error(err);
    });
    this.loadEntries('footer').subscribe((footers) => {
      this.footers = footers.values;
      if (this.footers.length > 0) {
        this.form.setValue({ footerKey: this.footers[0].key });
      }
    }, (err) => {
      console.error(err);
    });
  }

  loadUserRecordsPage(): void {
    this.dataSource.loadPage(this.filter);
  }

  editRecord(record: UserRecord, $event: MouseEvent): void {
    $event.preventDefault();
    $event.stopPropagation();
    const data: OperatorRecordElement = {
      bodyKey: record.bodyKey,
      value: record.value
    };
    this.dialog.open<UserRecordEditorDialogComponent, OperatorRecordElement>(UserRecordEditorDialogComponent, {
      data: data
    }).afterClosed().subscribe((result) => {
      if (result) {
        const previousIndex = this.operatorRecordsElements.findIndex(element => element.bodyKey === result.bodyKey);
        if (previousIndex < 0) {
          this.operatorRecordsElements.push(result);
        } else {
          this.operatorRecordsElements[previousIndex] = result;
        }
      }
    });
  }

  showOperatorForm(): void {
    this.displayOperatorForm = true;
  }

  loadEntries(entriesType: ModelDataType): Observable<CollectionPage<ModelEntry>> {
    const entriesFilter: ModelFilter = {
      types: [entriesType],
      page: 0,
      size: 10,
      order: 'name',
      direction: 'asc'
    };
    return this.modelsResource.listEntries(entriesFilter);
  }

  removeElement(element: OperatorRecordElement): void {
      const index = this.operatorRecordsElements.findIndex(e => e.bodyKey === element.bodyKey);
      this.operatorRecordsElements.splice(index, 1);
  }

  submit(): void {
    if (this.form.valid) {
      this.form.disable();
      const formValue = this.form.getRawValue();

      const elements: string[] = [];
      for (const element of this.operatorRecordsElements) {
        elements.push(element.bodyKey);
      }

      const context: ConsentContext = {
        subject: this.filter.user,
        owner: '', // géré côté backend
        orientation: ConsentFormOrientation.VERTICAL,
        header: formValue.headerKey,
        elements: elements,
        footer: formValue.footerKey,
        callback: '',
        locale: formValue.locale,
        formType: ConsentFormType.FULL,
        receiptDeliveryType: 'DISPLAY',
        userinfos: {},
        attributes: {},
        optoutEmail: '',
        collectionMethod: CollectionMethod.OPERATOR,
        author: this.keycloak.getUsername(),
        preview: false,
        conditions: false,
        iframe: false
      };

      this.consentsResource.generateToken(context).subscribe((token) => {
        const values = {};
        this.operatorRecordsElements.forEach(element => values[element.bodyKey] = element.value);

        const dto: OperatorRecordDto = {
          token: token,
          values: values,
          comment: formValue.comment
        };

        this.consentsResource.createOperatorRecords(dto).subscribe((result) => {
          console.log('Receipt : ' + result);
          this.router.navigate(['../'], { relativeTo: this.activatedRoute });
        }, (err) => {
          console.error(err);
          this.form.enable();
        });
      }, (err) => {
        console.error(err);
        this.form.enable();
      });
    }
  }
}
