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
import { catchError, debounceTime, mergeMap, startWith } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../../../../environments/environment';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AlertService } from '../../../../../core/services/alert.service';
import { FormStateSaver } from '../../../utils/form-state-saver';

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

  private readonly defaultLocale = environment.customization.defaultLocale;

  protected constructor(
    context: string,
    protected modelsResourceService: ModelsResourceService,
    protected alertService: AlertService,
    protected sanitizer: DomSanitizer) {
    super(context);
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
      debounceTime(this.previewDelay)
    ).subscribe(() => {
      this.formStateChanged();
      this.refreshPreview();
    });
  }

  protected refreshPreview(): void {
    const rawValues: T = this.form.getRawValue();
    const locale = this.defaultLocale;
    if (locale) {
      const dto: PreviewDto = {
        locale: locale,
        orientation: ConsentFormOrientation.VERTICAL,
        data: rawValues
      };
      const versionId = this.version ? this.version.id : this.modelsResourceService.NEW_VERSION_UUID;
      this.modelsResourceService.getVersionPreview(this.entry.id, versionId, dto)
        .subscribe((result: string) => {
          result = result.replace(/\/assets\//g, `${environment.managerUrl}/assets/`);
          this.safePreview = this.sanitizer.bypassSecurityTrustHtml(result);
        });
    }
  }

  public selectVersion(version: ModelVersionDtoLight, locale: string = this.version.defaultLocale): void {
    this.modelsResourceService.getVersion<T>(this.entry.id, version.id).subscribe(v => this.setVersion(v, locale));
  }

  protected setVersion(version: ModelVersionDto<T>, locale: string = this.version.defaultLocale): void {
    this.version = version;
    if (this.isLatestVersion()) {
      this.form.enable();
    } else {
      this.form.disable();
    }
    this.form.patchValue(this.version.data[locale]);
    this.initialValue = _.cloneDeep(this.form.getRawValue());
  }

  private updateVersion(version: ModelVersionDto<T>): void {
    this.version = version;
    this.modelsResourceService.getEntry(this.entry.id).subscribe(e => this.entry = e);
    this.form.markAsPristine();
    this.setVersion(this.version);
  }

  save(): void {
    if (!this.hasChanges) {
      this.alertService.info('ALERT.NO_CHANGE');
      return;
    }
    if (this.form.valid) {
      let obs: Observable<ModelVersionDto<T>>;
      const data: T = this.form.getRawValue();
      const dto: ModelVersionDto<T> = {
        defaultLocale: this.defaultLocale,
        availableLocales: [this.defaultLocale],
        data: {[this.defaultLocale]: data}
      };
      if (this.version?.status === ModelVersionStatus.DRAFT) {
        obs = this.modelsResourceService.updateVersion<T>(this.entry.id, this.version.id, dto);
      } else {
        obs = this.modelsResourceService.createVersion<T>(this.entry.id, dto);
      }
      obs.subscribe(version => {
        this.updateVersion(version);
        this.clearSavedState();
        this.alertService.success('ALERT.SAVE_SUCCESS');
      }, err => {
        this.alertService.error('ALERT.SAVE_ERROR', err);
      });
    }
  }

  activate(): void {
    if (this.hasChanges) {
      this.alertService.info('ALERT.UNSAVED_CHANGES');
      return;
    }
    this.modelsResourceService.updateVersionStatus<T>(this.entry.id, this.version.id, ModelVersionStatus.ACTIVE)
      .subscribe(version => {
        this.updateVersion(version);
        this.alertService.success('ALERT.ACTIVATION_SUCCESS');
      }, err => {
        this.alertService.error('ALERT.ACTIVATION_ERROR', err);
      });
  }

  delete(): void {
    this.modelsResourceService.deleteVersion(this.entry.id, this.version.id).pipe(
      catchError((err) => {
        this.alertService.error('ALERT.DELETION_ERROR', err);
        return EMPTY;
      }),
      mergeMap(() => {
        this.alertService.success('ALERT.DELETION_SUCCESS');
        if (this.entry.versions.length > 2) {
          return this.modelsResourceService.getVersion(this.entry.id, this.entry.versions[this.entry.versions.length - 2].id);
        }
        return of(null);
      })
    ).subscribe(version => {
      this.updateVersion(version);
    }, (err: HttpErrorResponse) => {
      if (err.status === 404) {
        this.version = null;
        this.initForm();
      } else {
        this.alertService.error('ALERT.RELOAD_ERROR', err);
      }
    });
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
