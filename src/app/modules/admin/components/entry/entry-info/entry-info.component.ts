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
import { ModelEntryDto, ModelVersionDto, ModelVersionDtoLight } from '../../../../../core/models/models';
import { ConfirmDialogComponent } from '../../../../../core/components/confirm-dialog/confirm-dialog.component';
import { RecordsResourceService } from '../../../../../core/http/records-resource.service';
import { filter, map, mergeMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { hasActiveVersion } from '../../../../../core/utils/model-entry.utils';
import { ModelsResourceService } from '../../../../../core/http/models-resource.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '../../../../../core/services/alert.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'cm-entry-info',
  templateUrl: './entry-info.component.html',
  styleUrls: ['./entry-info.component.scss']
})
export class EntryInfoComponent implements OnInit {

  @Input()
  entry: ModelEntryDto;

  @Input()
  version: ModelVersionDto;

  @Output()
  selectVersion = new EventEmitter<ModelVersionDtoLight>();

  @Input()
  showType = true;

  hasRecord$: Observable<boolean>;

  get hasActiveVersion(): boolean {
    return this.entry && hasActiveVersion(this.entry);
  }

  constructor(
    private dialog: MatDialog,
    private recordService: RecordsResourceService,
    private modelsResourceService: ModelsResourceService,
    private router: Router,
    private alertService: AlertService,
    private route: ActivatedRoute,
    private translate: TranslateService
  ) {
  }

  ngOnInit(): void {
    this.hasRecord$ = this.recordService.extractRecords({
        condition: {
          key: this.entry?.key,
          regexpValue: true,
          value: '.*'
        }
      }
    ).pipe(map(response => response.length > 0));
  }

  edit(): void {
    this.dialog.open<EntryEditorDialogComponent, EntryEditorDialogComponentData>(EntryEditorDialogComponent, {
      data: {entry: this.entry}
    }).afterClosed().subscribe((updatedEntry) => {
      if (updatedEntry != null) {
        this.entry = updatedEntry;
      }
    });
  }

  delete(): void {
    this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: this.translate.instant('ENTRIES.DIALOG.DELETION.TITLE'),
        content: this.translate.instant('ENTRIES.DIALOG.DELETION.CONTENT'),
      }
    }).afterClosed()
      .pipe(
        filter((confirmed) => !!confirmed),
        mergeMap(() => this.modelsResourceService.deleteModel(this.entry.id))
      )
      .subscribe({
        next: () => {
          this.alertService.success('ALERT.MODEL_DELETION_SUCCESS');
          this.router.navigate(['..'], {relativeTo: this.route});
        },
        error: (err) => {
          this.alertService.error('ALERT.MODEL_DELETION_ERROR', err);
        }
      });
  }

  versionIndex(): number {
    return this.entry.versions.findIndex(v => v.id === this.version.id) + 1;
  }
}
