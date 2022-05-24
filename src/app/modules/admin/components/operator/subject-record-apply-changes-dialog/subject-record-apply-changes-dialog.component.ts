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
import { listEntries, ModelEntryDto, ModelEntryHelper } from '@fairandsmart/consents-ce/models';

export interface SubjectRecordApplyChangesDialogDataInput {
  recipient: string;
}

export interface SubjectRecordApplyChangesDialogDataOutput {
  object?: string;
  recipient?: string;
  email?: string;
  comment?: string;
}

@Component({
  selector: 'cm-subject-record-apply-changes-dialog',
  templateUrl: './subject-record-apply-changes-dialog.component.html',
  styleUrls: ['./subject-record-apply-changes-dialog.component.scss']
})
export class SubjectRecordApplyChangesDialogComponent implements OnInit {

  public form: FormGroup;
  public emails: ModelEntryDto[] = [];

  constructor(private dialogRef: MatDialogRef<SubjectRecordApplyChangesDialogComponent, SubjectRecordApplyChangesDialogDataOutput>,
              @Inject(MAT_DIALOG_DATA) public data: SubjectRecordApplyChangesDialogDataInput,
              private fb: FormBuilder) {}

  ngOnInit(): void {
    listEntries({types : ['email']}).subscribe( (result) => {
      this.emails = result.values.filter(value => ModelEntryHelper.hasActiveVersion(value));
      if (result.totalCount === 0) {
        this.form.get('recipient').disable();
        this.form.get('email').disable();
      }
    });
    this.form = this.fb.group({
      object: [''],
      comment: [''],
      notify: [true],
      recipient: [''],
      email: ['']
    });
    this.form.get('notify').valueChanges.subscribe(notify => {
      if (notify) {
        this.form.get('recipient').setValidators([Validators.email, Validators.required]);
        this.form.get('email').setValidators(Validators.required);
      } else {
        this.form.get('recipient').clearValidators();
        this.form.get('recipient').updateValueAndValidity();
        this.form.get('email').clearValidators();
        this.form.get('email').updateValueAndValidity();
      }
    });
    this.form.patchValue(this.data);
    this.form.enable();
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.form.disable();
    const result: SubjectRecordApplyChangesDialogDataOutput = { comment: this.form.get('comment').value };
    if (this.form.get('object').value) {
      result.object = this.form.get('object').value;
    }
    if (this.form.get('notify').value) {
      result.recipient = this.form.get('recipient').value.trim();
      result.email = this.form.get('email').value.key;
    }
    this.dialogRef.close(result);
  }
}
