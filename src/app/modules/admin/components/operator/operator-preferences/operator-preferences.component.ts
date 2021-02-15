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
import { Component, OnInit } from '@angular/core';
import { OperatorConsentListDirective } from '../operator-consent-list/operator-consent-list.directive';
import { getActiveVersion, Preference } from '@fairandsmart/consent-manager/models';
import {
  SubjectRecordEditorDialogComponent,
  SubjectRecordEditorDialogData
} from '../subject-record-editor-dialog/subject-record-editor-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import {ConfigService} from '../../../../../core/services/config.service';
import { CoreService } from '../../../../../core/services/core.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Icons } from '../../../../../core/models/common';

@Component({
  selector: 'cm-operator-preferences',
  templateUrl: './operator-preferences.component.html',
  styleUrls: ['../operator-consent-list/_operator-consent-list.directive.scss', './operator-preferences.component.scss']
})
export class OperatorPreferencesComponent extends OperatorConsentListDirective implements OnInit {

  readonly ICONS = Icons;
  private readonly defaultLanguage;

  public displayedColumns = ['key', 'name', 'value', 'recordCreation', 'actions'];
  public pageSizeOptions = [10, 25, 50];

  constructor(
    private dialog: MatDialog,
    protected translate: TranslateService,
    private configService: ConfigService,
    protected coreService: CoreService,
    protected snackBar: MatSnackBar
  ) {
    super(coreService, snackBar, translate);
    this.defaultLanguage = this.configService.getDefaultLanguage();
  }

  ngOnInit(): void {
    this.type = 'preference';
    super.ngOnInit();
  }

  action(element): void {
    super.action(element);
    getActiveVersion(element.id).subscribe((version) => {
      let versionDto: Preference;
      if (version.data[this.translate.currentLang]) {
        versionDto = version.data[this.translate.currentLang] as Preference;
      } else {
        versionDto = version.data[this.defaultLanguage] as Preference;
      }
      this.dialog.open<SubjectRecordEditorDialogComponent, SubjectRecordEditorDialogData>(SubjectRecordEditorDialogComponent, {
        data: {
          record: element,
          valueType: versionDto.valueType,
          options: versionDto.options
        }
      }).afterClosed().subscribe((result) => {
        this.operatorAction.emit(result);
      });
    });
  }

  formatValue(value): string {
    return value !== undefined ? value.split(',').join(' ; ') : '-';
  }

}
