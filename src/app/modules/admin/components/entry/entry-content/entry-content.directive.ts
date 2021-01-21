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
import { Directive, Input, OnInit } from '@angular/core';
import {
  ConsentFormOrientation,
  ModelData,
  ModelDataType,
  ModelEntryDto,
  ModelVersionDto,
  ModelVersionDtoLight,
  ModelVersionStatus,
  PreviewDto
} from '../../../../../core/models/models';
import { EMPTY, Observable, of } from 'rxjs';
import { ModelsResourceService } from '../../../../../core/http/models-resource.service';
import * as _ from 'lodash';
import { catchError, debounceTime, distinctUntilChanged, map, mergeMap, startWith } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../../../../environments/environment';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AlertService } from '../../../../../core/services/alert.service';
import { FormStateSaver } from '../../../utils/form-state-saver';
import {ConfigService} from '../../../../../core/services/config.service';

@Directive()
export abstract class EntryContentDirective<T extends ModelData> extends FormStateSaver implements OnInit {

  @Input()
  entry: ModelEntryDto;

  @Input()
  version: ModelVersionDto<T>;
  initialValue: T;

  private previewDelay = 500;

  public safePreview: SafeHtml;

  readonly STATUS = ModelVersionStatus;

  private readonly defaultLanguage;

  protected constructor(
    context: string,
    protected modelsResourceService: ModelsResourceService,
    protected alertService: AlertService,
    protected sanitizer: DomSanitizer,
    protected configService: ConfigService) {
    super(context);
    this.defaultLanguage = configService.config.language;
  }

  ngOnInit(): void {
    this.setContextId(this.entry?.key || ''); // disambiguation of the context to avoid cross-entry form state saving
    this.initForm();
    if (this.version) {
      this.setVersion(this.version);
    }
  }

  get hasChanges(): boolean {
    return !_.isEqual(this.initialValue, this.form.getRawValue());
  }

  abstract get type(): ModelDataType;

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
    ).subscribe((e) => {
      this.formStateChanged();
      this.refreshPreview();
    });
  }

  protected makePreviewDto(language, values): PreviewDto {
    return {
      language: language,
      orientation: ConsentFormOrientation.VERTICAL,
      data: values
    };
  }

  protected refreshPreview(): void {
    const rawValues: T = this.form.getRawValue();
    const language = this.defaultLanguage;
    if (language) {
      const dto: PreviewDto = this.makePreviewDto(language, rawValues);
      const versionId = this.version ? this.version.id : this.modelsResourceService.NEW_VERSION_UUID;
      this.modelsResourceService.getVersionPreview(this.entry.id, versionId, dto)
        .subscribe((result: string) => {
          result = result.replace(/\/assets\//g, `${environment.managerUrl}/assets/`);
          this.safePreview = this.sanitizer.bypassSecurityTrustHtml(result);
        });
    }
  }

  public selectVersion(version: ModelVersionDtoLight, language: string = version.defaultLanguage): void {
    this.modelsResourceService.getVersion<T>(this.entry.id, version.id).subscribe(v => this.setVersion(v, language));
  }

  protected setVersion(version: ModelVersionDto<T>, language: string = version.defaultLanguage): void {
    this.version = version;
    if (this.isLatestVersion()) {
      this.form.enable();
    } else {
      this.form.disable();
    }
    this.form.patchValue(this.version.data[language]);
    this.initialValue = _.cloneDeep(this.form.getRawValue());
  }

  private updateVersion(version: ModelVersionDto<T>): Observable<[ModelEntryDto, ModelVersionDto<T>]> {
    return this.modelsResourceService.getEntry(this.entry.id).pipe(
      catchError((err) => {
        this.alertService.error('ALERT.UNKNOWN_ERROR', err);
        return EMPTY;
      }),
      map((entry) => {
        this.entry = entry;
        if (version) {
          this.setVersion(version);
        }
        this.clearSavedState();
        this.form.markAsPristine();
        return [entry, version];
      })
    );
  }

  save(): void {
    if (!this.hasChanges) {
      this.alertService.info('ALERT.NO_CHANGE');
      return;
    }
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.alertService.error('ALERT.FORM_ERROR', 'Form invalid');
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
      obs = this.modelsResourceService.updateVersion<T>(this.entry.id, this.version.id, dto);
    } else {
      obs = this.modelsResourceService.createVersion<T>(this.entry.id, dto);
    }
    obs.pipe(
      catchError((err) => {
        this.form.enable();
        this.alertService.error('ALERT.SAVE_ERROR', err);
        return EMPTY;
      }),
      mergeMap((version) => {
        this.alertService.success('ALERT.SAVE_SUCCESS', {snackBarConfig: {duration: 6000}});
        return this.updateVersion(version);
      })
    ).subscribe();
  }

  activate(): void {
    if (this.hasChanges) {
      this.alertService.info('ALERT.UNSAVED_CHANGES');
      return;
    }
    this.form.disable();
    this.modelsResourceService.updateVersionStatus<T>(this.entry.id, this.version.id, ModelVersionStatus.ACTIVE).pipe(
      catchError((err) => {
        this.form.enable();
        this.alertService.error('ALERT.ACTIVATION_ERROR', err);
        return EMPTY;
      }),
      mergeMap((version) => {
        this.alertService.success('ALERT.ACTIVATION_SUCCESS');
        return this.updateVersion(version);
      })
    ).subscribe();
  }

  delete(): void {
    this.modelsResourceService.deleteVersion(this.entry.id, this.version.id).pipe(
      catchError((err) => {
        this.form.enable();
        this.alertService.error('ALERT.DELETION_ERROR', err);
        return EMPTY;
      }),
      mergeMap(() => {
        this.alertService.success('ALERT.DELETION_SUCCESS');
        if (this.entry.versions.length > 2) {
          return this.modelsResourceService.getVersion(this.entry.id, this.entry.versions[this.entry.versions.length - 2].id);
        }
        return of(null);
      }),
      catchError((err: HttpErrorResponse) => {
        if (err.status === 404) {
          this.version = null;
          this.form.enable();
          this.initForm();
        } else {
          this.form.enable();
          this.alertService.error('ALERT.RELOAD_ERROR', err);
        }
        return EMPTY;
      }),
      mergeMap((version) => this.updateVersion(version))
    ).subscribe();
  }

  isLatestVersion(): boolean {
    return this.entry && (this.entry.versions.length < 2 || _.last(this.entry.versions).id === this.version.id);
  }

  registerFormChanges(): void {
    this.initPreview();
  }

  restoreFormArray(controlName: string, state: any[]): void {
    return;
  }

}
