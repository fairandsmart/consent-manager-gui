import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { OperatorRecordElement } from '../models';

@Component({
  selector: 'app-user-record-editor-dialog',
  templateUrl: './user-record-editor-dialog.component.html',
  styleUrls: ['./user-record-editor-dialog.component.scss']
})
export class UserRecordEditorDialogComponent implements OnInit {

  public form: FormGroup;

  constructor(private dialogRef: MatDialogRef<UserRecordEditorDialogComponent, OperatorRecordElement>,
              @Inject(MAT_DIALOG_DATA) public data: OperatorRecordElement,
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
      const formValue = this.form.getRawValue();
      const result: OperatorRecordElement = {
        bodyKey: this.data.bodyKey,
        value: formValue.value
      };
      this.dialogRef.close(result);
    }
  }
}
