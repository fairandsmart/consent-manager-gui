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
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Key } from '@fairandsmart/consents-ce/keys';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'cm-generated-key-dialog',
  templateUrl: 'generated-key-dialog.component.html',
  styleUrls: ['./generated-key-dialog.component.scss']
})
export class GeneratedKeyDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: Key, public toaster: MatSnackBar, public translate: TranslateService) {
  }

  copied(): void {
    this.toaster.open(this.translate.instant('COMMON.ACTIONS.COPIED'));
  }
}
