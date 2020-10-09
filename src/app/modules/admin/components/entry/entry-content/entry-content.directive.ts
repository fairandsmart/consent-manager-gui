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
import { FormGroup } from '@angular/forms';
import { ModelsResourceService } from '../../../../../core/http/models-resource.service';
import * as _ from 'lodash';
import { catchError, debounceTime, mergeMap, startWith } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../../../../environments/environment';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AlertService } from '../../../../../core/services/alert.service';

@Directive()
export abstract class EntryContentDirective<T extends ModelData> implements OnInit {

  @Input()
  entry: ModelEntryDto;

  @Input()
  version: ModelVersionDto<T>;

  form: FormGroup;

  initialValue: T;

  private previewDelay = 500;

  public safePreview: SafeHtml;

  readonly STATUS = ModelVersionStatus;

  private readonly defaultLocale = environment.customization.defaultLocale;

  protected constructor(
    protected modelsResourceService: ModelsResourceService,
    protected alertService: AlertService,
    protected sanitizer: DomSanitizer) {
  }

  ngOnInit(): void {
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

  protected initPreview(): void {
    this.form.valueChanges.pipe(
      startWith(this.form.getRawValue() as T),
      debounceTime(this.previewDelay)
    ).subscribe(() => {
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
      this.modelsResourceService.getVersionPreview(this.entry.id, this.version ? this.version.id : 'new', dto)
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
    this.initialValue = this.form.getRawValue();
  }

  private updateVersion(version: ModelVersionDto<T>): void {
    this.version = version;
    this.modelsResourceService.getEntry(this.entry.id).subscribe(e => this.entry = e);
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

}