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
import { ConsentContext } from '@fairandsmart/consent-manager/consents';
import { getPhpSnippetFromContext } from '../../../../core/constants/php-snippet';
import { getCurlSnippetFromContext } from '../../../../core/constants/curl-snippet';
import { environment } from '../../../../../environments/environment';

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

  readonly CODE_MIRROR_OPTIONS_PHP = {
    mode: 'php',
    readOnly: true
  };

  snippet: {
    php: string,
    curl: string,
    formUrl: string
  };

  constructor(private dialogRef: MatDialogRef<FormUrlDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: FormUrlDialogComponentData) {
    this.snippet = {
      php: getPhpSnippetFromContext(data.context),
      curl: getCurlSnippetFromContext(data.context),
      formUrl: environment.managerUrl + '/consents?t=PUT_YOUR_TOKEN_HERE'
    };
  }

  close(): void {
    this.dialogRef.close();
  }
}
