import { Component, Inject, OnInit } from '@angular/core';
import {
  CONSENT_ELEMENT_DATA_TYPES,
  ConsentElementDataType,
  ConsentElementEntry,
  ConsentsResourceService,
  CreateEntryDto,
  FIELD_VALIDATORS, UpdateEntryDto
} from '../consents-resource.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';

export interface EntryEditorDialogComponentData {
  entry?: ConsentElementEntry;
}

@Component({
  selector: 'app-entry-editor-dialog',
  templateUrl: './entry-editor-dialog.component.html',
  styleUrls: ['./entry-editor-dialog.component.scss']
})
export class EntryEditorDialogComponent implements OnInit {

  form: FormGroup;

  readonly TYPES = CONSENT_ELEMENT_DATA_TYPES;

  constructor(private dialogRef: MatDialogRef<EntryEditorDialogComponent, ConsentElementEntry>,
              @Inject(MAT_DIALOG_DATA) public data: EntryEditorDialogComponentData,
              private fb: FormBuilder,
              private consentsResource: ConsentsResourceService) {
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      type: ['', [
        Validators.required
      ]],
      key: ['', [
        Validators.required,
        Validators.pattern(FIELD_VALIDATORS.key.pattern)
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
    }
    this.enableForm();
  }

  submit(): void {
    if (this.form.valid) {
      this.form.disable();
      let obs: Observable<ConsentElementEntry>;
      const formValue = this.form.getRawValue();
      if (this.data?.entry != null) {
        const dto: UpdateEntryDto = {
          name: formValue.name,
          description: formValue.description
        };
        obs = this.consentsResource.updateEntry(this.data.entry.id, dto);
      } else {
        const dto: CreateEntryDto = {
          type: formValue.type,
          key: formValue.key,
          name: formValue.name,
          description: formValue.description
        };
        obs = this.consentsResource.createEntry(dto);
      }
      obs.subscribe((entry) => {
        this.dialogRef.close(entry);
      }, (err) => {
        console.error(err);
        this.enableForm();
      });
    }
  }

  private enableForm(): void {
    this.form.enable();
    if (this.data?.entry != null) {
      this.form.get('type').disable();
      this.form.get('key').disable();
    }
  }

}
