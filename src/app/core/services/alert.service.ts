import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSnackBarConfig } from '@angular/material/snack-bar/snack-bar-config';
import { ConfirmDialogComponent, ConfirmDialogData } from '../components/confirm-dialog/confirm-dialog.component';
import * as _ from 'lodash';

@Injectable()
export class AlertService {

  constructor(private translate: TranslateService, private dialog: MatDialog, private snack: MatSnackBar) {
  }

  info(key: string, options: {snackBarConfig?: MatSnackBarConfig, interpolateParams?: object} = {}): void {
    options = _.merge({snackBarConfig: {panelClass: 'mat-snack-bar-info'}}, options);
    this.alert(key, options);
  }

  warn(key: string, options: {snackBarConfig?: MatSnackBarConfig, interpolateParams?: object} = {}): void {
    options = _.merge({snackBarConfig: {panelClass: 'mat-snack-bar-warning'}}, options);
    this.alert(key, options);
  }

  success(key: string, options: {snackBarConfig?: MatSnackBarConfig, interpolateParams?: object} = {}): void {
    options = _.merge({snackBarConfig: {panelClass: 'mat-snack-bar-success'}}, options);
    this.alert(key, options);
  }

  error(key: string, error: any, options: {snackBarConfig?: MatSnackBarConfig, interpolateParams?: object} = {}): void {
    console.error(error);
    options = _.merge({snackBarConfig: {panelClass: 'mat-snack-bar-error', duration: 5000}}, options);
    this.alert(key, options);
  }

  private alert(key: string, options: {snackBarConfig?: MatSnackBarConfig, interpolateParams?: object}): void {
    this.translate.get(key, options.interpolateParams).subscribe((message: string) => {
      this.snack.open(message, '', options.snackBarConfig);
    });
  }

  confirm(config: MatDialogConfig<ConfirmDialogData> & { data: ConfirmDialogData })
    : MatDialogRef<ConfirmDialogComponent, boolean> {
    return this.dialog.open(ConfirmDialogComponent, config);
  }

}
