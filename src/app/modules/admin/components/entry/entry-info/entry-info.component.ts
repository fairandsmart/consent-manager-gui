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
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EntryEditorDialogComponent, EntryEditorDialogComponentData } from '../entry-editor-dialog/entry-editor-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import {
  deleteEntry,
  ModelEntryDto,
  ModelEntryStatus,
  ModelVersionDto,
  ModelVersionDtoLight,
  ModelVersionType,
} from '@fairandsmart/consents-ce/models';
import { ConfirmDialogComponent } from '../../../../../core/components/confirm-dialog/confirm-dialog.component';
import { filter, mergeMap } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '../../../../../core/services/alert.service';
import { TranslateService } from '@ngx-translate/core';
import { CoreService } from '../../../../../core/services/core.service';
import { ExtractionConfigOperator, extractRecords } from '@fairandsmart/consents-ce/records';
import * as _ from 'lodash';

@Component({
  selector: 'cm-entry-info',
  templateUrl: './entry-info.component.html',
  styleUrls: ['./entry-info.component.scss']
})
export class EntryInfoComponent implements OnInit {

  public readonly Status = ModelEntryStatus;

  @Input()
  entry: ModelEntryDto;

  @Input()
  version: ModelVersionDto;

  @Output()
  selectVersion = new EventEmitter<ModelVersionDtoLight>();

  @Input()
  showType = false;

  hasRecord: boolean;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private alertService: AlertService,
    private route: ActivatedRoute,
    private translate: TranslateService,
    private coreService: CoreService
  ) {
  }

  ngOnInit(): void {
    extractRecords({
        page: 0,
        size: 10,
        operator: ExtractionConfigOperator.AND,
        conditions: [
          {
            key: this.entry?.key,
            value: '.*',
            regexpValue: true
          }
        ]
      }
    ).subscribe(response => this.hasRecord = response.totalCount > 0);
  }

  editEntry(): void {
    this.dialog.open<EntryEditorDialogComponent, EntryEditorDialogComponentData>(EntryEditorDialogComponent, {
      data: {entry: this.entry}
    }).afterClosed().subscribe((updatedEntry) => {
      if (updatedEntry != null) {
        this.entry = updatedEntry;
      }
    });
  }

  deleteModelEntry(): void {
    this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: this.translate.instant('ENTRIES.DIALOG.DELETION.TITLE'),
        content: this.translate.instant('ENTRIES.DIALOG.DELETION.CONTENT')
          + (this.hasRecord ? this.translate.instant('ENTRIES.DIALOG.DELETION.HAS_RECORDS') : '')
      }
    }).afterClosed().pipe(
      filter((confirmed) => !!confirmed),
      mergeMap(() => deleteEntry(this.entry.id))
    ).subscribe({
      next: () => {
        this.alertService.success('ALERT.ENTRY_DELETION_SUCCESS');
        if (this.entry.type === 'information') {
          this.coreService.checkInfo();
        }
        this.router.navigate(['..'], {relativeTo: this.route});
      },
      error: (err) => {
        this.alertService.error('ALERT.ENTRY_DELETION_ERROR', err);
        if (this.entry.type === 'information') {
          this.coreService.checkInfo();
        }
      }
    });
  }

  getVersionIndex(version?: ModelVersionDtoLight): string | number {
    if (!version) {
      version = this.version;
    }
    const vIdx = this.entry.versions.findIndex(v => v.id === version.id);
    const majorVersions = this.entry.versions.filter((v, idx) => v.type === ModelVersionType.MAJOR || idx === 0);
    if (version.type === ModelVersionType.MINOR) {
      let majorIdx = _.findLastIndex(this.entry.versions, {type: ModelVersionType.MAJOR}, vIdx);
      if (majorIdx === -1) { majorIdx = 0; }
      const majorVersion = majorVersions.findIndex((v) => v === this.entry.versions[majorIdx]);
      return (majorVersion + 1) + '.' + (vIdx - majorIdx);
    } else {
      return (majorVersions.findIndex(v => v.id === version.id) + 1) + '.0';
    }
  }

}
