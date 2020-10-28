import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable, Subject } from 'rxjs';
import { CreateModelDto, FIELD_VALIDATORS, ModelDataType, ModelEntryDto, UpdateModelDto } from '../../../../../core/models/models';
import { ModelsResourceService } from '../../../../../core/http/models-resource.service';
import { HttpErrorResponse } from '@angular/common/http';
import { mergeMap } from 'rxjs/operators';

export interface EntryEditorDialogComponentData {
  entry: Partial<ModelEntryDto> & {type: ModelDataType};
}

@Component({
  selector: 'cm-entry-editor-dialog',
  templateUrl: './entry-editor-dialog.component.html',
  styleUrls: ['./entry-editor-dialog.component.scss']
})
export class EntryEditorDialogComponent implements OnInit {

  public form: FormGroup;

  public updating = false;

  constructor(private dialogRef: MatDialogRef<EntryEditorDialogComponent, ModelEntryDto>,
              @Inject(MAT_DIALOG_DATA) public data: EntryEditorDialogComponentData,
              private fb: FormBuilder,
              private modelsResourceService: ModelsResourceService) {
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      type: ['', [
        Validators.required
      ]],
      name: ['', [
        Validators.required,
        Validators.minLength(FIELD_VALIDATORS.name.min),
        Validators.maxLength(FIELD_VALIDATORS.name.max)
      ]],
      description: ['', [
        Validators.maxLength(FIELD_VALIDATORS.description.max)
      ]]
    });
    if (this.data?.entry != null) {
      this.form.patchValue(this.data.entry);
      if (this.data.entry.key != null) {
        this.updating = true;
      }
    }
    this.enableForm();
  }

  generateKey(): Observable<string> {
    return new Observable((observer) => {
      const rootKey = this.form.get('type').value;
      let increment = 1;
      const keyCheck$ = new Subject<void>();
      keyCheck$.pipe(
        mergeMap(() => this.modelsResourceService.listEntriesByKeys([rootKey + '.' + increment])),
      ).subscribe((result) => {
        if (!result || result.length === 0) {
          observer.next(rootKey + '.' + increment);
          observer.complete();
        } else {
          increment++;
          keyCheck$.next();
        }
      });
      keyCheck$.next();
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.form.disable();
    let obs: Observable<ModelEntryDto>;
    const formValue = this.form.getRawValue();
    if (this.data?.entry.key != null) {
      const dto: UpdateModelDto = {
        name: formValue.name,
        description: formValue.description
      };
      obs = this.modelsResourceService.updateEntry(this.data.entry.id, dto);
    } else {
      obs = this.generateKey().pipe(
        mergeMap((key) => {
          const dto: CreateModelDto = {
            type: formValue.type,
            key,
            name: formValue.name,
            description: formValue.description
          };
          return this.modelsResourceService.createEntry(dto);
        })
      );
    }
    obs.subscribe((entry) => {
      this.dialogRef.close(entry);
    }, (err: HttpErrorResponse) => {
      console.error(err);
      this.enableForm();
      if (err.status === 409) {
        this.form.get('key').setErrors({alreadyExists: true});
      }
    });
  }

  private enableForm(): void {
    this.form.enable();
    if (this.data?.entry != null) {
      if (this.data.entry.type) {
        this.form.get('type').disable();
      }
      if (this.data.entry.key) {
        this.form.get('key').disable();
      }
    }
  }

}
