import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { UserRecord, UserRecordDto } from '../models';
import { ConsentsResourceService } from '../consents-resource.service';

export interface UserRecordEditorDialogComponentData {
  record: UserRecord;
  owner: string;
  subject: string;
}

@Component({
  selector: 'app-user-record-editor-dialog',
  templateUrl: './user-record-editor-dialog.component.html',
  styleUrls: ['./user-record-editor-dialog.component.scss']
})
export class UserRecordEditorDialogComponent implements OnInit {

  form: FormGroup;

  constructor(private dialogRef: MatDialogRef<UserRecordEditorDialogComponent, UserRecord>,
              @Inject(MAT_DIALOG_DATA) public data: UserRecordEditorDialogComponentData,
              private fb: FormBuilder,
              private consentsResourceService: ConsentsResourceService) {
  }

  ngOnInit(): void {
    if (!this.data.record.owner) {
      this.data.record.owner = this.data.owner;
    }
    if (!this.data.record.subject) {
      this.data.record.subject = this.data.subject;
    }
    this.form = this.fb.group({
      value: ['', [
        Validators.required
      ]]
    });
    this.form.patchValue(this.data.record);
    this.form.enable();
  }

  submit(): void {
    if (this.form.valid) {
      this.form.disable();
      let obs: Observable<UserRecord>;
      const formValue = this.form.getRawValue();
      const dto: UserRecordDto = {
        bodyKey: this.data.record.bodyKey,
        owner: this.data.record.owner,
        subject: this.data.record.subject,
        value: formValue.value
      };
      obs = this.consentsResourceService.putRecord(dto);
      obs.subscribe((record) => {
        this.dialogRef.close(record);
      }, (err) => {
        console.error(err);
        this.form.enable();
      });
    }
  }

}
