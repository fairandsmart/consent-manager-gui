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
import { BasicInfo, Controller } from '@fairandsmart/consent-manager/models';
import { FormBuilder, Validators } from '@angular/forms';
import { AlertService } from '../../../../../core/services/alert.service';
import { ConfigService } from '../../../../../core/services/config.service';
import { CoreService } from '../../../../../core/services/core.service';
import { BreakpointObserver } from '@angular/cdk/layout';
import { FIELD_VALIDATORS } from '../../../../../core/models/common';

@Component({
  selector: 'cm-basicinfo',
  templateUrl: './basicinfo.component.html',
  styleUrls: ['../entry-content/_entry-content.directive.scss', './basicinfo.component.scss']
})
export class BasicinfoComponent extends EntryContentDirective<BasicInfo> implements OnInit {

  constructor(
    private fb: FormBuilder,
    alertService: AlertService,
    configService: ConfigService,
    private coreService: CoreService,
    breakpointObserver: BreakpointObserver) {
    super(alertService, configService, breakpointObserver);
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
      collectionMethod: [''],
      collectionMethodVisible: [false],
      scope: [''],
      scopeVisible: [false],
      shortNoticeLink: [''],
      shortNoticeLinkVisible: [false],
      privacyPolicyUrl: ['', [Validators.required]],
      customPrivacyPolicyText: ['']
    });
    this.form.get('dataControllerVisible').disable();
    this.form.get('jurisdictionVisible').disable();
    this.form.get('collectionMethodVisible').disable();
    this.form.get('scopeVisible').disable();
    this.form.get('shortNoticeLinkVisible').disable();
    this.checkFormState();
  }

  registerFormChanges(): void {
    this.form.get('jurisdiction').valueChanges.subscribe(v => this.optionalFieldChange(v, 'jurisdictionVisible'));
    this.form.get('collectionMethod').valueChanges.subscribe(v => this.optionalFieldChange(v, 'collectionMethodVisible'));
    this.form.get('scope').valueChanges.subscribe(v => this.optionalFieldChange(v, 'scopeVisible'));
    this.form.get('shortNoticeLink').valueChanges.subscribe(v => this.optionalFieldChange(v, 'shortNoticeLinkVisible'));
    this.form.get('dataController').valueChanges.subscribe(v => this.dataControllerChange(v));
    super.registerFormChanges();
  }

  private optionalFieldChange(value: string, linkedControllerName: keyof BasicInfo): void {
    if (value.length > 0) {
      this.form.get(linkedControllerName).enable();
    } else {
      this.form.get(linkedControllerName).setValue(false);
      this.form.get(linkedControllerName).disable();
    }
  }

  private dataControllerChange(dataController: Controller): void {
    if (this.isDataControllerEmpty(dataController)) {
      this.form.get('dataControllerVisible').setValue(false);
      this.form.get('dataControllerVisible').disable();
    } else {
      this.form.get('dataControllerVisible').enable();
    }
  }

  private isDataControllerEmpty(dataController: Controller): boolean {
    if (this.form.contains('dataController')) {
      return !['company', 'info', 'address', 'email', 'phoneNumber']
        .some(k => dataController[k] != null && dataController[k].length > 0);
    }
    return true;
  }

  protected afterActivateVersion(): void {
    this.coreService.checkBasicInfo();
  }

  protected afterDeleteVersion(): void {
    this.coreService.checkBasicInfo();
  }

}
