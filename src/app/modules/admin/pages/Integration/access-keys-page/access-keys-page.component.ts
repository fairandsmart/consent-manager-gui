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
import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { createKey, deleteKey, Key, KeyScope } from '@fairandsmart/consents-ce/keys';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from '../../../../../core/services/alert.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { KeysDataSource } from './keys-datasource';
import { Icons } from '../../../../../core/models/common';

@Component({
  selector: 'cm-keys',
  templateUrl: './access-keys-page.component.html',
  styleUrls: ['./access-keys-page.component.scss']
})
export class AccessKeysPageComponent implements OnInit, AfterViewInit {

  public displayedColumns: string[] = ['name', 'scope', 'creationDate', 'lastAccessDate', 'actions'];

  public dataSource: KeysDataSource;

  public form: FormGroup;

  readonly ICONS = Icons;
  readonly SCOPES = Object.keys(KeyScope);

  constructor(
    private dialog: MatDialog,
    private alertService: AlertService,
    private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.dataSource = new KeysDataSource();
    this.loadKeys();
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(25)]],
      scope: [undefined, [Validators.required]]
    });
  }

  ngAfterViewInit(): void {
    this.loadKeys();
  }

  loadKeys(): void {
    this.dataSource.load();
  }

  dropKey(key: Key): void {
    this.alertService.confirm({
      data: {
        title: 'API.KEYS.DROP.CONFIRM_TITLE',
        content: 'API.KEYS.DROP.CONFIRM_CONTENT',
        confirm: 'API.KEYS.DROP.CONFIRM_BUTTON'
      }
    }).afterClosed().subscribe(confirmed => {
      if (confirmed) {
        deleteKey(key.id).subscribe(() => {
          this.alertService.success('API.KEYS.DROP.SUCCESS');
          this.loadKeys();
        });
      }
    });
  }

  generateKey(): void {
    if (this.form.valid) {
      this.form.disable();
      const key: Key = {
        name: this.form.get('name').value,
        scope: this.form.get('scope').value
      };
      createKey(key).subscribe(response => {
        this.dialog.open(GeneratedKeyDialogComponent, {data: response});
        this.loadKeys();
        this.form.enable();
        this.form.reset({name: ''});
      });
    }
  }

}

@Component({
  selector: 'cm-generated-key-dialog',
  templateUrl: 'generated-key-dialog.html',
  styleUrls: ['./generated-key-dialog.scss']
})
export class GeneratedKeyDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: Key, public toaster: MatSnackBar, public translate: TranslateService) {
  }

  copied(): void {
    this.toaster.open(this.translate.instant('COMMON.ACTIONS.COPIED'));
  }
}
