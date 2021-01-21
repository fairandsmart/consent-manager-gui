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
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable, Subject } from 'rxjs';
import { CreateModelDto, FIELD_VALIDATORS, ModelDataType, ModelEntryDto, UpdateModelDto } from '../../../../../core/models/models';
import { ModelsResourceService } from '../../../../../core/http/models-resource.service';
import { HttpErrorResponse } from '@angular/common/http';
import { mergeMap } from 'rxjs/operators';

export interface EntryEditorDialogComponentData {
  entry: Partial<ModelEntryDto> & { type: ModelDataType };
}

@Component({
  selector: 'cm-entry-editor-dialog',
  templateUrl: './entry-editor-dialog.component.html',
  styleUrls: ['./entry-editor-dialog.component.scss']
})
export class EntryEditorDialogComponent implements OnInit {

  public form: FormGroup;

  public updating = false;

  static formatKey(root, increment): string {
    return root + '.' + ('000' + increment).substr(-3);
  }

  constructor(private dialogRef: MatDialogRef<EntryEditorDialogComponent, ModelEntryDto>,
              @Inject(MAT_DIALOG_DATA) public data: EntryEditorDialogComponentData,
              private fb: FormBuilder,
              private modelsResource: ModelsResourceService) {
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
      this.modelsResource.listEntries({ types: [rootKey], size: -1 }).subscribe((entries) => {
        let increment = entries.values.length + 1;
        const keyCheck$ = new Subject<void>();
        keyCheck$.pipe(
          mergeMap(() => this.modelsResource.listEntries({
            keys: [EntryEditorDialogComponent.formatKey(rootKey, increment)],
            size: -1
          })),
        ).subscribe((result) => {
          if (!result || result.values.length === 0) {
            observer.next(EntryEditorDialogComponent.formatKey(rootKey, increment));
            observer.complete();
          } else {
            increment++;
            keyCheck$.next();
          }
        });
        keyCheck$.next();
      });
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
      obs = this.modelsResource.updateEntry(this.data.entry.id, dto);
    } else {
      obs = this.generateKey().pipe(
        mergeMap((key) => {
          const dto: CreateModelDto = {
            type: formValue.type,
            key,
            name: formValue.name,
            description: formValue.description
          };
          return this.modelsResource.createEntry(dto);
        })
      );
    }
    obs.subscribe((entry) => {
      this.dialogRef.close(entry);
    }, (err: HttpErrorResponse) => {
      console.error(err);
      this.enableForm();
    });
  }

  private enableForm(): void {
    this.form.enable();
    if (this.data?.entry != null) {
      if (this.data.entry.type) {
        this.form.get('type').disable();
      }
    }
  }

}
