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
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConsentContext } from '@fairandsmart/consents-ce/consents';
import { getPhpSnippetFromContext } from '../../../../core/constants/php-snippet';
import { getCurlTokenSnippetFromContext, getCurlLocationSnippet } from '../../../../core/constants/curl-snippet';
import {AceConfigInterface} from 'ngx-ace-wrapper';

export interface FormUrlDialogComponentData {
  url: string;
  context: ConsentContext;
}

@Component({
  selector: 'cm-form-url-dialog',
  templateUrl: './form-url-dialog.component.html',
  styleUrls: ['./form-url-dialog.component.scss']
})
export class FormUrlDialogComponent {

  readonly ACE_OPTIONS: AceConfigInterface = {
    readOnly: true,
  };

  snippet: {
    php: string,
    curl1: string,
    curl2: string,
    json: string,
  };

  constructor(private dialogRef: MatDialogRef<FormUrlDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: FormUrlDialogComponentData) {
    this.snippet = {
      php: getPhpSnippetFromContext(data.context),
      curl1: getCurlTokenSnippetFromContext(data.context),
      curl2: getCurlLocationSnippet(),
      json: JSON.stringify(data.context, null, 4),
    };
  }

  close(): void {
    this.dialogRef.close();
  }
}
