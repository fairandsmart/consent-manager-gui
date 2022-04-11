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
import {Component, OnInit} from '@angular/core';
import {EntryContentDirective} from '../entry-content/entry-content.directive';
import {
  Controller,
  ModelVersionDto,
  Processing,
  PROCESSING_PURPOSES,
  ProcessingPurpose,
  RETENTION_UNITS,
  RetentionUnit
} from '@fairandsmart/consents-ce/models';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AlertService} from '../../../../../core/services/alert.service';
import {TranslateService} from '@ngx-translate/core';
import {ConfigService} from '../../../../../core/services/config.service';
import {FIELD_VALIDATORS} from '../../../../../core/models/common';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'cm-processing',
  templateUrl: './processing.component.html',
  styleUrls: ['../entry-content/_entry-content.directive.scss', './processing.component.scss']
})
export class ProcessingComponent extends EntryContentDirective<Processing> implements OnInit {

  readonly PURPOSES = PROCESSING_PURPOSES;
  readonly RETENTION_UNITS = RETENTION_UNITS;

  constructor(
    private fb: FormBuilder,
    alertService: AlertService,
    protected translate: TranslateService,
    configService: ConfigService,
    dialog: MatDialog) {
    super(alertService, configService, dialog, translate);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  protected initForm(): void {
    this.form = this.fb.group({
      type: [this.type, [Validators.required]],
      title: ['', [Validators.required]],
      data: ['', [Validators.required]],
      retention: this.fb.group({
        label: ['', [Validators.required]],
        value: [0, [Validators.required, Validators.min(1)]],
        unit: [RetentionUnit.YEAR, [Validators.required]],
        fullText: ['']
      }),
      usage: ['', [Validators.required]],
      purposes: [[], [Validators.required]],
      containsSensitiveData: [false],
      containsMedicalData: [false],
      dataController: this.fb.group({
        company: [''],
        info: [''],
        address: [''],
        email: ['', Validators.email],
        phoneNumber: ['', Validators.pattern(FIELD_VALIDATORS.phone.pattern)]
      }),
      dataControllerVisible: [false],
      thirdParties: this.fb.array([])
    });
    this.form.get('dataControllerVisible').disable();
    this.form.get('retention').valueChanges.subscribe((value) => {
      this.form.get('retention').get('fullText')
        .patchValue(`${value.label} ${value.value} ${this.translate.instant('ENTRIES.EDITOR.PROCESSING.RETENTION.UNIT.VALUES.' + value.unit)}`, {emitEvent: false});
    });
    this.checkFormState();
  }

  registerFormChanges(): void {
    this.form.get('containsSensitiveData').valueChanges.subscribe(v => {
        if (this.canBeEdited()) {
          if (v) {
            this.form.get('containsMedicalData').enable();
          } else {
            this.form.get('containsMedicalData').setValue(false);
          }
        }
    });
    this.form.get('dataController').valueChanges.subscribe(v => this.dataControllerChange(v));
    super.registerFormChanges();
  }

  protected setVersion(version: ModelVersionDto<Processing>,
                       language: string = version?.defaultLanguage || this.configService.getDefaultLanguage()): void {
    this.form.setControl('thirdParties', this.fb.array([]));
    if (version) {
      version.data[language].thirdParties.forEach(() => this.addThirdParty());
    }
    super.setVersion(version, language);
  }

  restoreFormArray(controlName: string, state: any[]): void {
    if (controlName === 'thirdParties') {
      this.form.controls.thirdParties = this.fb.array([]);
      state.forEach(() => this.addThirdParty());
      this.getThirdParties().setValue(state);
    }
  }

  getThirdParties(): FormArray {
    return this.form.controls.thirdParties as FormArray;
  }

  getSensitiveData(): FormGroup {
    return this.form.controls.containsSensitiveData as FormGroup;
  }

  addThirdParty(): void {
    this.getThirdParties().push(this.fb.group({
      name: ['', [Validators.required]],
      value: ['', [Validators.required]]
    }));
  }

  removeThirdParty(index: number): void {
    this.getThirdParties().removeAt(index);
  }

  purposesChange(purposes: ProcessingPurpose[]): void {
    if (!purposes.includes(ProcessingPurpose.CONSENT_THIRD_PART_SHARING)) {
      this.getThirdParties().clear();
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

}
