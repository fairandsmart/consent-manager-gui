import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SubjectDto } from '../../../../../core/models/models';
import { FormControl, Validators } from '@angular/forms';
import * as _ from 'lodash';

@Component({
  selector: 'cm-subject-infos-editor-dialog',
  templateUrl: './subject-infos-editor-dialog.component.html',
  styleUrls: ['./subject-infos-editor-dialog.component.scss']
})
export class SubjectInfosEditorDialogComponent implements OnInit {

  control: FormControl;

  constructor(private dialogRef: MatDialogRef<SubjectInfosEditorDialogComponent, SubjectDto>,
              @Inject(MAT_DIALOG_DATA) public data: SubjectDto) {
  }

  ngOnInit(): void {
    this.control = new FormControl(this.data.emailAddress, [Validators.required, Validators.email]);
  }

  submit(): void {
    const result: SubjectDto = _.cloneDeep(this.data);
    result.emailAddress = this.control.value;
    this.dialogRef.close(result);
  }
}
