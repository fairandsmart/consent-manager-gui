import { Directive, Input, OnInit } from '@angular/core';
import { ModelData, ModelEntry, ModelVersion, ModelVersionStatus } from '../models';
import { Observable } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { ModelsResourceService } from '../models-resource.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Directive()
export abstract class EntryContentDirective<T extends ModelData> implements OnInit {

  @Input()
  entry: ModelEntry;

  @Input()
  version: ModelVersion<T>;

  form: FormGroup;

  protected constructor(private modelsResourceService: ModelsResourceService, private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.initForm();
    if (this.version) {
      this.loadVersion(this.version);
    }
  }

  protected abstract initForm(): void;

  protected loadVersion(version: ModelVersion<T>, locale: string = this.version.defaultLocale): void {
    const localeContent = version.content[locale].dataObject;
    this.form.patchValue(localeContent);
  }

  save(): void {
    if (this.form.valid) {
      let obs: Observable<ModelVersion<T>>;
      if (this.version?.status === ModelVersionStatus.DRAFT) {
        obs = this.modelsResourceService.updateVersion(this.entry.id, this.version.id, {
          locale: 'en',
          content: this.form.getRawValue()
        });
      } else {
        obs = this.modelsResourceService.createVersion(this.entry.id, {
          locale: 'en',
          content: this.form.getRawValue()
        });
      }
      obs.subscribe(version => {
        this.version = version;
        this.snackBar.open('Content saved!', null, {
          duration: 3000
        });
      }, err => {
        console.error(err);
      });
    }
  }

}
