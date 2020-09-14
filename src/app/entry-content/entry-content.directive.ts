import { Directive, Input, OnInit } from '@angular/core';
import { ModelData, ModelEntry, ModelVersionDto, ModelVersionStatus } from '../models';
import { EMPTY, Observable } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';
import { ModelsResourceService } from '../models-resource.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as _ from 'lodash';
import { catchError, debounceTime, mergeMap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';

@Directive()
export abstract class EntryContentDirective<T extends ModelData> implements OnInit {

  @Input()
  entry: ModelEntry;

  @Input()
  version: ModelVersionDto<T>;

  form: FormGroup;

  initialValue: T;

  previewLocaleCtrl: FormControl;
  displayedLocalesCtrl: FormControl;
  private previewDelay = 500;

  readonly STATUS = ModelVersionStatus;

  protected constructor(
      protected modelsResourceService: ModelsResourceService,
      private snackBar: MatSnackBar,
      private translateService: TranslateService) {}

  ngOnInit(): void {
    this.initForm();
    if (this.version) {
      this.loadVersion(this.version);
    }
  }

  get hasChanges(): boolean {
    return !_.isEqual(this.initialValue, this.form.getRawValue());
  }

  protected abstract initForm(): void;

  protected initPreview(): void {
    const defaultLocale = this.version.defaultLocale == null ? 'en' : this.version.defaultLocale; // TODO default value
    const locales = this.version.availableLocales == null ? [defaultLocale] : this.version.availableLocales;
    this.displayedLocalesCtrl = new FormControl(defaultLocale ? [defaultLocale] : locales);
    this.previewLocaleCtrl = new FormControl(defaultLocale);
    this.form.valueChanges.pipe(debounceTime(this.previewDelay)).subscribe(() => {
      this.refreshPreview();
    });
    this.previewLocaleCtrl.valueChanges.subscribe(() => {
      this.refreshPreview();
    });
  }

  protected abstract refreshPreview(): void;

  protected loadVersion(version: ModelVersionDto<T>, locale: string = this.version.defaultLocale): void {
    const localeContent = version.data[locale];
    this.form.patchValue(localeContent);
    this.initialValue = this.form.getRawValue();
  }

  private updateVersion(version: ModelVersionDto<T>): void {
    this.version = version;
    this.loadVersion(this.version);
  }

  private showSnackbar(messageKey) {
    this.translateService.get(messageKey).subscribe(translation => this.snackBar.open(translation));
  }

  save(): void {
    if (!this.hasChanges) {
      this.showSnackbar('MATERIAL.SNACKBAR.NO_CHANGE');
      return;
    }
    if (this.form.valid) {
      let obs: Observable<ModelVersionDto<T>>;
      const formValue = this.form.getRawValue();
      const locale = formValue.locale;
      delete formValue.locale;
      if (this.version?.status === ModelVersionStatus.DRAFT) {
        obs = this.modelsResourceService.updateVersion(this.entry.id, this.version.id, {
          locale: locale,
          content: formValue
        });
      } else {
        obs = this.modelsResourceService.createVersion(this.entry.id, {
          locale: locale,
          content: formValue
        });
      }
      obs.subscribe(version => {
        this.updateVersion(version);
        this.showSnackbar('MATERIAL.SNACKBAR.SAVE_SUCCESS');
      }, err => {
        this.showSnackbar('MATERIAL.SNACKBAR.SAVE_ERROR');
        console.error(err);
      });
    }
  }

  activate(): void {
    if (this.hasChanges) {
      this.showSnackbar('MATERIAL.SNACKBAR.UNSAVED_CHANGES');
      return;
    }
    this.modelsResourceService.updateVersionStatus<T>(this.entry.id, this.version.id, ModelVersionStatus.ACTIVE)
      .subscribe(version => {
        this.updateVersion(version);
        this.showSnackbar('MATERIAL.SNACKBAR.ACTIVATION_SUCCESS');
      }, err => {
        this.showSnackbar('MATERIAL.SNACKBAR.ACTIVATION_ERROR');
        console.error(err);
      });
  }

  delete(): void {
    this.modelsResourceService.deleteVersion(this.entry.id, this.version.id).pipe(
      catchError((err) => {
        this.showSnackbar('MATERIAL.SNACKBAR.DELETION_ERROR');
        console.error(err);
        return EMPTY;
      }),
      mergeMap(() => {
        this.showSnackbar('MATERIAL.SNACKBAR.DELETION_SUCCESS');
        return this.modelsResourceService.getLatestVersion<T>(this.entry.id);
      })
    ).subscribe(version => {
      this.updateVersion(version);
    }, (err: HttpErrorResponse) => {
      if (err.status === 404) {
        this.version = null;
        this.initForm();
      } else {
        console.error(err);
        this.showSnackbar('MATERIAL.SNACKBAR.RELOAD_ERROR');
      }
    });
  }

}
