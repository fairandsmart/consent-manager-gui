import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import {
  UserRecord,
  OperatorRecordDto,
  ConsentContext,
  ConsentFormOrientation,
  ConsentFormType,
  CollectionMethod
} from '../models';
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

  constructor(private dialogRef: MatDialogRef<UserRecordEditorDialogComponent, OperatorRecordDto>,
              @Inject(MAT_DIALOG_DATA) public data: UserRecordEditorDialogComponentData,
              private fb: FormBuilder,
              private consentsResource: ConsentsResourceService) {
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

      const context: ConsentContext = {
        subject: this.data.subject,
        owner: '', // géré côté backend
        orientation: ConsentFormOrientation.VERTICAL,
        header: 'h2', // TODO dynamic
        elements: [this.data.bodyKey],
        footer: 'f2', // TODO dynamic
        callback: '',
        locale: 'en',
        formType: ConsentFormType.FULL,
        receiptDeliveryType: 'NONE',
        userinfos: {},
        attributes: {},
        optoutEmail: '',
        collectionMethod: CollectionMethod.OPERATOR,
        preview: false,
        iframe: false
      };

      this.consentsResource.generateToken(context).subscribe((token) => {
        const dto: OperatorRecordDto = {
          token: token,
          author: this.data.author,
          value: formValue.value,
          comment: formValue.comment
        };
        this.dialogRef.close(dto);
      }, (err) => {
        console.error(err);
        this.form.enable();
      });
    }
  }

}
