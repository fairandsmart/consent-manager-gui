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
import { RecordStatus } from '@fairandsmart/consents-ce/records';
import { CoreService } from '../../../../../core/services/core.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { Icons } from '../../../../../core/models/common';

@Component({
  selector: 'cm-operator-conditions',
  templateUrl: './operator-conditions.component.html',
  styleUrls: ['../operator-consent-list/_operator-consent-list.directive.scss', './operator-conditions.component.scss']
})
export class OperatorConditionsComponent extends OperatorConsentListDirective implements OnInit {

  readonly ICONS = Icons;
  public displayedColumns = [
    'key', 'name', 'version', 'recordCreation', 'status'
  ];
  public pageSizeOptions = [10, 25, 50];

  constructor(
    protected coreService: CoreService,
    protected snackBar: MatSnackBar,
    protected translate: TranslateService
  ) {
    super(coreService, snackBar, translate);
  }

  ngOnInit(): void {
    this.type = 'conditions';
    super.ngOnInit();
  }

  getVersion(element): string {
    if (element.versionIndex) {
      return 'v' + element.versionIndex;
    } else {
      return '-';
    }
  }

  getRecordStatus(element): string {
    return element.status === RecordStatus.VALID && element.value === 'accepted' ? 'VALID' : 'INVALID';
  }

}
