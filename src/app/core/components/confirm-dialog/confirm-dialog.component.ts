import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface ConfirmDialogData {
  title: string;
  content: string;
  cancel?: string;
  confirm?: string;
  titleParams?: any;
  contentParams?: any;
  hideCancel?: boolean;
}

@Component({
  selector: 'cm-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
})
export class ConfirmDialogComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData) {
  }

}
