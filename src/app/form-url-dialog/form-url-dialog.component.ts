import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface FormUrlDialogComponentData {
  url: string;
}

@Component({
  selector: 'app-form-url-dialog',
  templateUrl: './form-url-dialog.component.html',
  styleUrls: ['./form-url-dialog.component.scss']
})
export class FormUrlDialogComponent {

  // public subject = '';

  constructor(private dialogRef: MatDialogRef<FormUrlDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: FormUrlDialogComponentData) { }

  close(): void {
    this.dialogRef.close();
  }
}
