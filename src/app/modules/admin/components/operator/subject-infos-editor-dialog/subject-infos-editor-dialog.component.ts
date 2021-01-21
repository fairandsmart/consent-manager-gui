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
