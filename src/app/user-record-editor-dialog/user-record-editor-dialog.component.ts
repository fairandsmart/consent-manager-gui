import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { UserRecord, OperatorRecordDto } from '../models';
import { ConsentsResourceService } from '../consents-resource.service';

export interface UserRecordEditorDialogComponentData {
  bodyKey: string;
  author: string;
  subject: string;
  value: string;
}

@Component({
  selector: 'app-user-record-editor-dialog',
  templateUrl: './user-record-editor-dialog.component.html',
  styleUrls: ['./user-record-editor-dialog.component.scss']
})
export class UserRecordEditorDialogComponent implements OnInit {

  public form: FormGroup;

  constructor(private dialogRef: MatDialogRef<UserRecordEditorDialogComponent, String>,
              @Inject(MAT_DIALOG_DATA) public data: UserRecordEditorDialogComponentData,
              private fb: FormBuilder,
              private consentsResourceService: ConsentsResourceService) {
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      value: ['', [
        Validators.required
      ]],
      comment: ['', [
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
      const dto: OperatorRecordDto = {
        bodyKey: this.data.bodyKey,
        author: this.data.author,
        subject: this.data.subject,
        value: formValue.value,
        comment: formValue.comment
      };
      this.consentsResourceService.putRecord(dto).subscribe((result) => {
        console.log(result);
        this.dialogRef.close(result);
      }, (err) => {
        console.error(err);
        this.form.enable();
      });
    }
  }

}
