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
import { Directive, Input, OnInit, ViewChild } from '@angular/core';
import { EMPTY, Observable, of, throwError } from 'rxjs';
import * as _ from 'lodash';
import { catchError, debounceTime, distinctUntilChanged, filter, map, mergeMap, startWith } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../../../../environments/environment';
import { AlertService } from '../../../../../core/services/alert.service';
import { FormStateSaver } from '../../../utils/form-state-saver';
import { ConfigService } from '../../../../../core/services/config.service';
import {
  FormLayoutOrientation,
  ModelData,
  ModelEntryDto,
  ModelEntryHelper,
  ModelEntryStatus,
  ModelVersionDto,
  ModelVersionDtoLight,
  ModelVersionStatus,
  ModelVersionType,
  PreviewDto,
  PreviewType
} from '@fairandsmart/consent-manager/models';
import { ModelsResource } from '@fairandsmart/consent-manager';
import { MatDialog } from '@angular/material/dialog';
import { ModelVersionSelectorComponent } from '../model-version-selector/model-version-selector.component';
import { TranslateService } from '@ngx-translate/core';
import { EntryEditorContainerComponent } from '../entry-editor-container/entry-editor-container.component';

@Directive()
export abstract class EntryContentDirective<T extends ModelData> extends FormStateSaver implements OnInit {

  @Input()
  entry: ModelEntryDto;

  @Input()
  version: ModelVersionDto<T>;
  initialValue: T;

  @ViewChild('container')
  container: EntryEditorContainerComponent;

  private readonly previewDelay = 500;
  private readonly defaultLanguage;
  readonly STATUS = ModelVersionStatus;

  public type: string;

  protected constructor(
    protected alertService: AlertService,
    protected configService: ConfigService,
    protected dialog: MatDialog,
    protected translate: TranslateService
  ) {
    super();
    this.defaultLanguage = configService.getDefaultLanguage();
  }

  ngOnInit(): void {
    this.type = this.entry.type;
    this.setContextId(this.entry?.key || ''); // disambiguation of the context to avoid cross-entry form state saving
    this.initForm();
    if (this.version) {
      this.setVersion(this.version);
    }
    this.enableFormIfAllowed();
  }

  get hasChanges(): boolean {
    return !_.isEqual(this.initialValue, this.form.getRawValue());
  }

  protected abstract initForm(): void;

  notifyExistingFormState(): void {
    this.alertService.confirm({
      data: {
        title: 'ENTRIES.COMMON.saveState.title',
        content: 'ENTRIES.COMMON.saveState.content',
        confirm: 'ENTRIES.COMMON.saveState.accept',
        cancel: 'ENTRIES.COMMON.saveState.refuse'
      }
    }).afterClosed().subscribe((restore) => {
      this.registerFormChanges();
      if (restore) {
        this.restoreFormState();
      } else {
        this.clearSavedState();
      }
    });
  }

  protected initPreview(): void {
    this.form.valueChanges.pipe(
      startWith(this.form.getRawValue() as T),
      debounceTime(this.previewDelay),
      distinctUntilChanged((a, b) => _.isEqual(a, b))
    ).subscribe(() => {
      this.formStateChanged();
      this.refreshPreview();
    });
  }

  protected makePreviewDto(language, values): PreviewDto {
    return {
      language: language,
      orientation: FormLayoutOrientation.VERTICAL,
      data: values,
      previewType: PreviewType.FORM
    };
  }

  refreshPreview(): void {
    const rawValues: T = this.form.getRawValue();
    const language = this.defaultLanguage;
    if (language) {
      const dto: PreviewDto = this.makePreviewDto(language, rawValues);
      const versionId = this.version ? this.version.id : ModelsResource.NEW_VERSION_UUID;
      ModelsResource.getVersionPreview(this.entry.id, versionId, dto)
        .subscribe((result: string) => {
          this.container.preview.updateHtml(result.replace(/\/assets\//g, `${environment.managerUrl}/assets/`));
        });
    }
  }

  public selectVersion(version: ModelVersionDtoLight, language: string = version.defaultLanguage): void {
    ModelsResource.getVersion<T>(this.entry.id, version.id).subscribe(v => this.setVersion(v, language));
  }

  protected setVersion(version: ModelVersionDto<T>,
                       language: string = version?.defaultLanguage || this.configService.getDefaultLanguage()): void {
    this.version = version;
    this.enableFormIfAllowed();
    if (this.version) {
      this.form.patchValue(this.version.data[language]);
    } else {
      this.initForm();
    }
    this.initialValue = _.cloneDeep(this.form.getRawValue());
  }

  private updateVersion(version: ModelVersionDto<T>): Observable<[ModelEntryDto, ModelVersionDto<T>]> {
    return ModelsResource.getEntry(this.entry.id).pipe(
      catchError((err) => {
        this.alertService.error('ALERT.UNKNOWN_ERROR', err);
        return EMPTY;
      }),
      map((entry) => {
        this.entry = entry;
        this.setVersion(version);
        this.clearSavedState();
        this.form.markAsPristine();
        return [entry, version];
      })
    );
  }

  saveVersion(): void {
    if (!this.hasChanges) {
      this.alertService.info('ALERT.NO_CHANGE');
      return;
    }
    let obs: Observable<ModelVersionDto<T>>;
    const data: T = this.form.getRawValue();
    this.form.disable({emitEvent: false});
    const dto: ModelVersionDto<T> = {
      defaultLanguage: this.defaultLanguage,
      availableLanguages: [this.defaultLanguage],
      data: {[this.defaultLanguage]: data}
    };
    if (this.version?.status === ModelVersionStatus.DRAFT) {
      obs = ModelsResource.updateVersion<T>(this.entry.id, this.version.id, dto);
    } else {
      obs = ModelsResource.createVersion<T>(this.entry.id, dto);
    }
    obs.pipe(
      catchError((err) => {
        this.enableFormIfAllowed();
        this.alertService.error('ALERT.SAVE_ERROR', err);
        return EMPTY;
      }),
      mergeMap((version) => {
        this.alertService.success('ALERT.SAVE_SUCCESS', {snackBarConfig: {duration: 6000}});
        return this.updateVersion(version);
      })
    ).subscribe(() => this.afterSaveVersion());
  }

  activateVersion(forceVersion?: 'minor' | 'major'): void {
    if (this.hasChanges) {
      this.alertService.error('ALERT.UNSAVED_CHANGES', 'Unsaved changes');
      return;
    }
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.alertService.error('ALERT.FORM_ERROR', 'Form invalid');
      return;
    }
    if (this.version.status === ModelVersionStatus.ACTIVE) {
      this.alertService.error('ALERT.ALREADY_ACTIVE', 'Already active');
      return;
    }
    let versionTypeSelector$ = of(null);
    if (ModelEntryHelper.hasActiveVersion(this.entry) && !forceVersion) {
      versionTypeSelector$ = this.dialog.open<ModelVersionSelectorComponent, ModelVersionType>(ModelVersionSelectorComponent).afterClosed();
    }
    this.form.disable();
    versionTypeSelector$.pipe(
      mergeMap((versionType) => {
        if (!ModelEntryHelper.hasActiveVersion(this.entry)) {
          // First version
          return of({});
        } else if (versionType === ModelVersionType.MAJOR || forceVersion === 'major') {
          // Upgrade to major version
          return this.alertService.confirm({data: {
              title: this.translate.instant('ENTRIES.DIALOG.UPGRADE_VERSION.CONFIRM_TITLE'),
              content: this.translate.instant('ENTRIES.DIALOG.UPGRADE_VERSION.CONFIRM_CONTENT'),
          }}).afterClosed()
            .pipe(mergeMap((confirmed) => {
              if (confirmed) {
                this.version.type = ModelVersionType.MAJOR;
                return ModelsResource.updateVersionType<T>(this.entry.id, this.version.id, ModelVersionType.MAJOR);
              } else {
                return throwError(new Error('aborted'));
              }
            }));
        } else if (versionType === ModelVersionType.MINOR || forceVersion === 'minor') {
          // Upgrade to minor version
          if (this.version.type === ModelVersionType.MAJOR || forceVersion === 'minor') {
            this.version.type = ModelVersionType.MINOR;
            return ModelsResource.updateVersionType<T>(this.entry.id, this.version.id, ModelVersionType.MINOR);
          }
          return of({});
        }
        return throwError(new Error('aborted'));
      }),
      mergeMap(() => ModelsResource.updateVersionStatus<T>(this.entry.id, this.version.id, ModelVersionStatus.ACTIVE)),
      catchError((err) => {
        if (err.message === 'aborted') {
          this.alertService.error('ALERT.ACTIVATION_ABORTED', err);
        } else {
          this.alertService.error('ALERT.ACTIVATION_ERROR', err);
        }
        this.enableFormIfAllowed();
        return EMPTY;
      }),
      mergeMap((version) => {
        this.alertService.success('ALERT.ACTIVATION_SUCCESS');
        return this.updateVersion(version);
      })
    ).subscribe(() => this.afterActivateVersion());
  }

  deleteDraft(): void {
    this.alertService.confirm({
      data: {
        title: 'ALERT.DRAFT_DELETION.CONFIRM',
        content: 'ALERT.DRAFT_DELETION.CONFIRM_CONTENT'
      }
    }).afterClosed().pipe(
      filter((confirm) => !!confirm),
      mergeMap(() => ModelsResource.deleteVersion(this.entry.id, this.version.id)),
      catchError((err) => {
        this.enableFormIfAllowed();
        this.alertService.error('ALERT.DELETION_ERROR', err);
        return EMPTY;
      }),
      mergeMap(() => {
        this.alertService.success('ALERT.DELETION_SUCCESS');
        if (this.entry.versions.length >= 2) {
          return ModelsResource.getVersion(this.entry.id, this.entry.versions[this.entry.versions.length - 2].id);
        }
        return of(null);
      }),
      catchError((err: HttpErrorResponse) => {
        if (err.status === 404) {
          this.version = null;
          this.initForm();
        } else {
          this.alertService.error('ALERT.RELOAD_ERROR', err);
        }
        this.enableFormIfAllowed();
        return EMPTY;
      }),
      mergeMap((version) => this.updateVersion(version))
    ).subscribe(() => this.afterDeleteVersion());
  }

  canBeEdited(): boolean {
    return this.entry && this.entry.status !== ModelEntryStatus.DELETED
      && (this.entry.versions.length < 2 || _.last(this.entry.versions).id === this.version.id);
  }

  enableFormIfAllowed(): void {
    if (this.canBeEdited()) {
      this.form.enable();
    } else {
      this.form.disable();
    }
  }

  registerFormChanges(): void {
    this.initPreview();
  }

  restoreFormArray(controlName: string, state: any[]): void {
    return;
  }

  protected afterActivateVersion(): void {}
  protected afterSaveVersion(): void {}
  protected afterDeleteVersion(): void {}

  disableSave(): boolean {
    return this.form?.invalid;
  }

  disableActivate(): boolean {
    return this.version?.status !== this.STATUS.DRAFT;
  }

  disableDelete(): boolean {
    return this.form?.disabled || this.version?.status !== this.STATUS.DRAFT;
  }

}
