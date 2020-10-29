import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import * as _ from 'lodash';
import { ModelsResourceService } from '../../../../../core/http/models-resource.service';
import { ModelEntryDto } from '../../../../../core/models/models';

export interface SubjectRecordApplyChangesDialogData {
  recipient: string;
  model: string;
  comment: string;
}

@Component({
  selector: 'cm-subject-record-apply-changes-dialog',
  templateUrl: './subject-record-apply-changes-dialog.component.html',
  styleUrls: ['./subject-record-apply-changes-dialog.component.scss']
})
export class SubjectRecordApplyChangesDialogComponent implements OnInit {

  public form: FormGroup;
  public models: ModelEntryDto[];

  constructor(private dialogRef: MatDialogRef<SubjectRecordApplyChangesDialogComponent, SubjectRecordApplyChangesDialogData>,
              @Inject(MAT_DIALOG_DATA) public data: SubjectRecordApplyChangesDialogData,
              private fb: FormBuilder,
              private modelsService: ModelsResourceService) {}

  ngOnInit(): void {
    this.modelsService.listEntries({types : ['email']}).subscribe( (result) => {
      this.models = result.values;
      if (result.totalCount === 0) {
        this.form.get('recipient').disable();
        this.form.get('model').disable();
      }
    });
    this.form = this.fb.group({
      comment: [''],
      notify: [false],
      recipient: [''],
      model: ['']
    });
    this.form.get('notify').valueChanges.subscribe(notify => {
      if (notify) {
        this.form.get('recipient').setValidators([Validators.email, Validators.required]);
        this.form.get('model').setValidators(Validators.required);
      } else {
        this.form.get('recipient').clearValidators();
        this.form.get('recipient').updateValueAndValidity();
        this.form.get('model').clearValidators();
        this.form.get('model').updateValueAndValidity();
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
    const result = _.cloneDeep(this.data);
    if (this.form.get('notify').value) {
      result.recipient = this.form.get('recipient').value.trim();
      result.model = this.form.get('model').value;
    }
    this.dialogRef.close(result);
  }
}
