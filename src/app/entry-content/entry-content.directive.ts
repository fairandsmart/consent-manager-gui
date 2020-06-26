import { Directive, Input, OnInit } from '@angular/core';
import { ModelData, ModelEntry, ModelVersion, ModelVersionStatus } from '../models';
import { EMPTY, Observable } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { ModelsResourceService } from '../models-resource.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as _ from 'lodash';
import { catchError, mergeMap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';

@Directive()
export abstract class EntryContentDirective<T extends ModelData> implements OnInit {

  @Input()
  entry: ModelEntry;

  @Input()
  version: ModelVersion<T>;

  form: FormGroup;

  initialValue: T;

  readonly STATUS = ModelVersionStatus;

  protected constructor(private modelsResourceService: ModelsResourceService, private snackBar: MatSnackBar) {
  }

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

  protected loadVersion(version: ModelVersion<T>, locale: string = this.version.defaultLocale): void {
    const localeContent = version.content[locale].dataObject;
    this.form.patchValue(localeContent);
    this.initialValue = this.form.getRawValue();
  }

  private updateVersion(version: ModelVersion<T>): void {
    this.version = version;
    this.loadVersion(this.version);
  }

  save(): void {
    if (!this.hasChanges) {
      this.snackBar.open('No change');
      return;
    }
    if (this.form.valid) {
      let obs: Observable<ModelVersion<T>>;
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
        this.snackBar.open('Content saved!');
      }, err => {
        this.snackBar.open('Cannot save content...');
        console.error(err);
      });
    }
  }

  activate(): void {
    if (this.hasChanges) {
      this.snackBar.open('Unsaved changes, cannot activate');
      return;
    }
    this.modelsResourceService.updateVersionStatus<T>(this.entry.id, this.version.id, ModelVersionStatus.ACTIVE)
      .subscribe(version => {
        this.updateVersion(version);
        this.snackBar.open('Version activated!');
      }, err => {
        this.snackBar.open('Cannot activate version...');
        console.error(err);
      });
  }

  delete(): void {
    this.modelsResourceService.deleteVersion(this.entry.id, this.version.id).pipe(
      catchError((err) => {
        this.snackBar.open('Cannot delete version...');
        console.error(err);
        return EMPTY;
      }),
      mergeMap(() => {
        this.snackBar.open('Version deleted!');
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
        this.snackBar.open('Cannot reload latest version...');
      }
    });
  }

}
