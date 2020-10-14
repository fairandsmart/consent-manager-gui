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
