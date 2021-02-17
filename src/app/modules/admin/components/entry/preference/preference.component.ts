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
import { Component, OnInit, ViewChild } from '@angular/core';
import { EntryContentDirective } from '../entry-content/entry-content.directive';
import { Preference, PREFERENCE_VALUE_TYPES, PreferenceValueType } from '@fairandsmart/consent-manager/models';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { AlertService } from '../../../../../core/services/alert.service';
import { MatChipInputEvent, MatChipList } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import * as _ from 'lodash';
import { ConfigService } from '../../../../../core/services/config.service';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'cm-preference',
  templateUrl: './preference.component.html',
  styleUrls: ['../entry-content/_entry-content.directive.scss', './preference.component.scss']
})
export class PreferenceComponent extends EntryContentDirective<Preference> implements OnInit {

  public readonly VALUE_TYPES_LIST = PREFERENCE_VALUE_TYPES;
  readonly VALUE_TYPES = PreferenceValueType;

  separatorKeysCodes: number[] = [ENTER, COMMA];
  optionsInputCtrl: FormControl;

  @ViewChild('optionsChipList')
  optionsChipList: MatChipList;

  constructor(
    private fb: FormBuilder,
    alertService: AlertService,
    configService: ConfigService,
    breakpointObserver: BreakpointObserver,
    dialog: MatDialog,
    translate: TranslateService) {
    super(alertService, configService, breakpointObserver, dialog, translate);
  }

  ngOnInit(): void {
    this.optionsInputCtrl = new FormControl('', Validators.required);
    super.ngOnInit();
    this.form.get('options').statusChanges.subscribe(status => {
      if (this.optionsChipList) {
        this.optionsChipList.errorState = status === 'INVALID';
      }
    });
  }

  protected initForm(): void {
    this.form = this.fb.group({
      type: [this.type, [Validators.required]],
      label: ['', [Validators.required]],
      description: [''],
      valueType: [PreferenceValueType.CHECKBOXES, [Validators.required]],
      optional: [false, [Validators.required]],
      options: [[], [Validators.required, Validators.minLength(1)]],
      includeDefault: [true, [Validators.required]],
      defaultValues: [[]]
    });
    this.checkFormState();
  }

  registerFormChanges(): void {
    this.form.get('valueType').valueChanges.subscribe(v => {
      if (v === PreferenceValueType.FREE_TEXT) {
        this.form.get('options').setValue([]);
        this.form.get('options').clearValidators();
        this.form.get('includeDefault').setValue(false);
      } else {
        const validators = [Validators.required, Validators.minLength(v === PreferenceValueType.CHECKBOXES ? 1 : 2)];
        if (v === PreferenceValueType.TOGGLE) {
          validators.push(Validators.maxLength(2));
        }
        this.form.get('options').setValidators(validators);
        this.updateDefaultValuesValidators(v);
      }
      this.form.get('options').updateValueAndValidity();
    });

    this.form.get('options').valueChanges.subscribe(v => {
      const defaultValues = this.form.get('defaultValues').value.filter(d => v.includes(d));
      this.form.get('defaultValues').setValue(defaultValues);
      this.form.get('defaultValues').updateValueAndValidity();
    });

    this.form.get('includeDefault').valueChanges.subscribe(() => {
      this.updateDefaultValuesValidators(this.form.get('valueType').value);
    });
    super.registerFormChanges();
  }

  addOption($event: MatChipInputEvent): void {
    const input = $event.input;
    const value = ($event.value || '').trim().toLowerCase();
    if (value) {
      const values: string[] = _.cloneDeep(this.form.get('options').value) || [];
      if (value.length > 0 && values.indexOf(value) === -1) {
        values.push(value);
        this.form.get('options').setValue(values);
      }
    }
    // Reset the input value
    if (input) {
      input.value = '';
    }
    this.optionsInputCtrl.setValue('');
  }

  removeOption(value: string): void {
    const values: string[] = this.form.get('options').value || [];
    this.form.get('options').setValue(values.filter(t => t !== value));
  }

  protected updateDefaultValuesValidators(valueType): void {
    if (this.form.get('includeDefault').value) {
      const validators = [Validators.required];
      if (valueType !== PreferenceValueType.LIST_MULTI && valueType !== PreferenceValueType.CHECKBOXES) {
        validators.push(Validators.maxLength(1));
      }
      this.form.get('defaultValues').setValidators(validators);
    } else {
      this.form.get('defaultValues').setValue([]);
      this.form.get('defaultValues').clearValidators();
    }
    this.form.get('defaultValues').updateValueAndValidity();
  }
}
