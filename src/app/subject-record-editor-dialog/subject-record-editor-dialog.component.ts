import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RecordDto } from '../models';
import * as _ from 'lodash';

@Component({
  selector: 'app-subject-record-editor-dialog',
  templateUrl: './subject-record-editor-dialog.component.html',
  styleUrls: ['./subject-record-editor-dialog.component.scss']
})
export class SubjectRecordEditorDialogComponent implements OnInit {

  public form: FormGroup;

  constructor(private dialogRef: MatDialogRef<SubjectRecordEditorDialogComponent, RecordDto>,
              @Inject(MAT_DIALOG_DATA) public data: RecordDto,
              private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      value: ['', [
        Validators.required
      ]]
    });
    this.form.patchValue(this.data);
    this.form.enable();
  }

  submit(): void {
    if (this.form.valid) {
      this.form.disable();
      const result = _.cloneDeep(this.data);
      result.value = this.form.getRawValue().value;
      this.dialogRef.close(result);
    }
  }
}
