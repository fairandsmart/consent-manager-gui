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
import { EntryContentDirective } from '../entry-content/entry-content.directive';
import { Information, Controller } from '@fairandsmart/consents-ce/models';
import { FormBuilder, Validators } from '@angular/forms';
import { AlertService } from '../../../../../core/services/alert.service';
import { ConfigService } from '../../../../../core/services/config.service';
import { CoreService } from '../../../../../core/services/core.service';
import { FIELD_VALIDATORS } from '../../../../../core/models/common';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'cm-information',
  templateUrl: './information.component.html',
  styleUrls: ['../entry-content/_entry-content.directive.scss', './information.component.scss']
})
export class InformationComponent extends EntryContentDirective<Information> implements OnInit {

  constructor(
    private fb: FormBuilder,
    alertService: AlertService,
    configService: ConfigService,
    private coreService: CoreService,
    keycloak: KeycloakService,
    dialog: MatDialog,
    translate: TranslateService) {
    super(alertService, configService, keycloak, dialog, translate);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  protected initForm(): void {
    this.form = this.fb.group({
      type: [this.type, [Validators.required]],
      title: ['', [Validators.required]],
      header: [''],
      footer: [''],
      dataController: this.fb.group({
        company: [''],
        info: [''],
        address: [''],
        email: ['', [Validators.email]],
        phoneNumber: ['', Validators.pattern(FIELD_VALIDATORS.phone.pattern)]
      }),
      dataControllerVisible: [false],
      jurisdiction: [''],
      jurisdictionVisible: [false],
      scope: [''],
      scopeVisible: [false],
      shortNoticeLink: [''],
      shortNoticeLinkVisible: [false],
      privacyPolicyUrl: ['', [Validators.required]],
      customPrivacyPolicyText: ['']
    });
    this.form.get('dataControllerVisible').disable();
    this.form.get('jurisdictionVisible').disable();
    this.form.get('scopeVisible').disable();
    this.form.get('shortNoticeLinkVisible').disable();
    this.checkFormState();
  }

  registerFormChanges(): void {
    this.form.get('jurisdiction').valueChanges.subscribe(v => this.optionalFieldChange(v, 'jurisdictionVisible'));
    this.form.get('scope').valueChanges.subscribe(v => this.optionalFieldChange(v, 'scopeVisible'));
    this.form.get('shortNoticeLink').valueChanges.subscribe(v => this.optionalFieldChange(v, 'shortNoticeLinkVisible'));
    this.form.get('dataController').valueChanges.subscribe(v => this.dataControllerChange(v));
    super.registerFormChanges();
  }

  private optionalFieldChange(value: string, linkedControllerName: keyof Information): void {
    if (this.canBeEdited()) {
      if (value.length > 0) {
        this.form.get(linkedControllerName).enable();
      } else {
        this.form.get(linkedControllerName).setValue(false);
        this.form.get(linkedControllerName).disable();
      }
    }
  }

  private dataControllerChange(dataController: Controller): void {
    if (this.canBeEdited()) {
      if (this.isDataControllerEmpty(dataController)) {
        this.form.get('dataControllerVisible').setValue(false);
        this.form.get('dataControllerVisible').disable();
      } else if (this.form.enabled) {
        this.form.get('dataControllerVisible').enable();
      }
    }
  }

  private isDataControllerEmpty(dataController: Controller): boolean {
    return !['company', 'info', 'address', 'email', 'phoneNumber']
      .some(k => dataController[k] != null && dataController[k].length > 0);
  }

  enableFormIfAllowed(): void {
    super.enableFormIfAllowed();
    this.dataControllerChange(this.form.get('dataController').value);
  }

  protected afterActivateVersion(): void {
    this.coreService.checkInfo();
  }

  protected afterDeleteVersion(): void {
    this.coreService.checkInfo();
  }

}
