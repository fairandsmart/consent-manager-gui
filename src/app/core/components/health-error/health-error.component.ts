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
import { Component } from '@angular/core';

@Component({
  selector: 'cm-health-error',
  template: `
    <h2 mat-dialog-title>{{'HEALTH.TITLE' | translate}}</h2>
    <mat-dialog-content>{{'HEALTH.CONTENT' | translate}}</mat-dialog-content>
    <mat-dialog-actions class="btn-uppercase align-right">
      <button mat-button color="primary" (click)="reload()">{{'HEALTH.RELOAD' | translate}}</button>
    </mat-dialog-actions>
  `
})
export class HealthErrorComponent {

  constructor() { }

  reload(): void {
    window.location.reload();
  }

}
