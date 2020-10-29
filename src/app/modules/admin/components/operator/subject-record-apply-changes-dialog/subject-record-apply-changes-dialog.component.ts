import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import * as _ from 'lodash';
import { ModelsResourceService } from '../../../../../core/http/models-resource.service';
import { Email, ModelEntryDto } from '../../../../../core/models/models';

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
    this.modelsService.listEntriesByType('email').subscribe( (entries) => {
      this.models = entries;
    });
    this.form = this.fb.group({
      comment: [''],
      recipient: [''],
      model: ['']
    });
    this.form.patchValue(this.data);
    this.form.enable();
  }

  submit(): void {
    if (this.form.valid) {
      this.form.disable();
      const result = _.cloneDeep(this.data);
      result.recipient = this.form.getRawValue().recipient;
      result.model = this.form.getRawValue().model;
      this.dialogRef.close(result);
    }
  }
}
