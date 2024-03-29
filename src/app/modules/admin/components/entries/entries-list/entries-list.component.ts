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
import { AfterViewInit, ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import {
  AddMultipleOption,
  ConsentElementEntryDataSource,
  PeerConsentElementEntryDataSource,
  SectionConfig
} from '../entries-library/entries-library.component';
import { tap } from 'rxjs/operators';
import { ModelDataType, ModelEntryStatus } from '@fairandsmart/consents-ce/models';
import { EntryEditorDialogComponent, EntryEditorDialogComponentData } from '../../entry/entry-editor-dialog/entry-editor-dialog.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { ConfigService } from '../../../../../core/services/config.service';
import { KeycloakService } from 'keycloak-angular';
import { Peer } from '@fairandsmart/consents-ce/peers';
import { Icons } from '../../../../../core/models/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'cm-entries-list',
  templateUrl: './entries-list.component.html',
  styleUrls: ['./entries-list.component.scss']
})
export class EntriesListComponent implements OnInit, AfterViewInit {

  readonly ADD_OPTIONS = AddMultipleOption;
  readonly ICONS = Icons;

  // tslint:disable-next-line:no-input-rename
  @Input('config')
  section: SectionConfig;

  @Input()
  peer: Peer;

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  constructor(
    private dialog: MatDialog,
    protected ref: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    protected translate: TranslateService,
    protected configService: ConfigService,
    private keycloak: KeycloakService,
    public http: HttpClient,
    ) {}

  ngOnInit(): void {
    if (this.section.dataSource == null) {
      if (this.peer !== undefined) {
        this.section.dataSource = new PeerConsentElementEntryDataSource(this.peer, this.http);
      } else {
        this.section.dataSource = new ConsentElementEntryDataSource();
      }
    }
    if (this.section.orderingOptions == null) {
      this.section.orderingOptions = ['name', 'key', 'creationDate', 'modificationDate'];
    }
    if (this.section.columns == null) {
      this.section.columns = 2;
    }
    if (this.section.filter == null) {
      this.section.filter = {
        types: this.section.types,
        page: 0,
        size: 12,
        order: 'name',
        direction: 'asc',
        keyword: '',
        statuses: [ModelEntryStatus.ACTIVE, ModelEntryStatus.INACTIVE],
        languages: [this.configService.getDefaultLanguage(), ''],
        shared: [true, false]
      };
    }
  }

  ngAfterViewInit(): void {
    this.paginator.pageSize = this.section.filter.size;
    this.section.dataSource.paginator = this.paginator;
    this.paginator.page.pipe(
      tap((e) => {
        this.section.filter.size = e.pageSize;
        this.section.filter.page = e.pageIndex;
        this.loadEntriesPage();
      })
    ).subscribe();
    this.loadEntriesPage();
  }

  isUserAdmin(): boolean {
    return this.keycloak.isUserInRole(this.configService.getRoleMapping('admin'));
  }

  loadEntriesPage(): void {
    this.section.dataSource.loadPage(this.section.filter);
  }

  newEntry(type: ModelDataType): void {
    this.dialog.open<EntryEditorDialogComponent, EntryEditorDialogComponentData>(EntryEditorDialogComponent, {
      data: {entry: {type}}
    }).afterClosed().subscribe((entry) => {
      if (entry != null) {
        this.router.navigate(['.', entry.id], {relativeTo: this.route});
      }
    });
  }

  displayAvailabilityWarning(): void {
    this.snackBar.open(this.translate.instant('ALERT.AVAILABLE_IN_ENTERPRISE'));
  }
}
