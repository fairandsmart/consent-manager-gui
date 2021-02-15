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
import { EntryCardContentDirective } from '../entry-card-content/entry-card-content.directive';
import { Preference, PreferenceValueType } from '@fairandsmart/consent-manager/models';
import { TranslateService } from '@ngx-translate/core';
import { FormControl, FormGroup } from '@angular/forms';
import { KeycloakService } from 'keycloak-angular';
import { AlertService } from '../../../../../core/services/alert.service';
import { ConfigService } from '../../../../../core/services/config.service';
import { CoreService } from '../../../../../core/services/core.service';

@Component({
  selector: 'cm-preference-user',
  templateUrl: './preference.component.html',
  styleUrls: ['../entry-card/entry-card.component.scss', './preference.component.scss']
})
export class PreferenceComponent extends EntryCardContentDirective<Preference> implements OnInit {

  readonly TYPES = PreferenceValueType;

  checkboxesGroup: FormGroup;

  constructor(
    translate: TranslateService,
    keycloakService: KeycloakService,
    alertService: AlertService,
    configService: ConfigService,
    coreService: CoreService
  ) {
    super(translate, keycloakService, alertService, configService, coreService);
  }

  ngOnInit(): void {
    this.remoteValue = this.record?.value;
    const state = this.parseValue();
    if (this.getData().valueType === PreferenceValueType.CHECKBOXES) {
      this.checkboxesGroup = new FormGroup({});
      this.getData().options.forEach(o => {
        this.checkboxesGroup.addControl(o, new FormControl(state.indexOf(o) !== -1));
      });
      this.checkboxesGroup.valueChanges.subscribe(v => {
        const checkedValues = Object.keys(v).filter(o => v[o]);
        this.control.setValue(checkedValues);
      });
    }
    this.control = new FormControl(state);
    this.control.valueChanges.subscribe(e => {
      this.changed.emit();
      if (this.autoSave) {
        this.doAutoSave();
      }
    });
  }

  public resetState(): void {
    const state = this.parseValue();
    this.control.setValue(state, {emitEvent: false});
    if (this.getData().valueType === PreferenceValueType.CHECKBOXES) {
      this.getData().options.forEach(o => {
        this.checkboxesGroup.get(o).setValue(state.indexOf(o) !== -1, {emitEvent: false});
      });
    }
  }

  protected enableControl(): void {
    super.enableControl();
    this.checkboxesGroup?.enable({emitEvent: false});
  }

  protected disableControl(): void {
    super.disableControl();
    this.checkboxesGroup?.disable({emitEvent: false});
  }

  parseValue(): any {
    switch (this.getData().valueType) {
      case PreferenceValueType.FREE_TEXT:
      case PreferenceValueType.RADIO_BUTTONS:
      case PreferenceValueType.LIST_SINGLE:
        return this.remoteValue;
      case PreferenceValueType.LIST_MULTI:
      case PreferenceValueType.CHECKBOXES:
        return this.remoteValue?.split(',') ?? [];
      case PreferenceValueType.TOGGLE:
        return this.remoteValue === this.getData().options[1];
    }
  }

  serializeValue(): string {
    switch (this.getData().valueType) {
      case PreferenceValueType.FREE_TEXT:
      case PreferenceValueType.RADIO_BUTTONS:
      case PreferenceValueType.LIST_SINGLE:
        return this.control.value;
      case PreferenceValueType.LIST_MULTI:
      case PreferenceValueType.CHECKBOXES:
        return this.control.value.join(',');
      case PreferenceValueType.TOGGLE:
        return this.control.value ? this.getData().options[1] : this.getData().options[0];
    }
  }

}
