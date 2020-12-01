import { Component, OnInit } from '@angular/core';
import { EntryContentDirective } from '../entry-content/entry-content.directive';
import {
  Controller,
  FIELD_VALIDATORS,
  ModelDataType,
  ModelEntryDto,
  ModelVersionDto,
  Processing,
  PROCESSING_PURPOSES,
  ProcessingPurpose,
  RETENTION_UNITS,
  RetentionUnit
} from '../../../../../core/models/models';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { ModelsResourceService } from '../../../../../core/http/models-resource.service';
import { DomSanitizer } from '@angular/platform-browser';
import { AlertService } from '../../../../../core/services/alert.service';

@Component({
  selector: 'cm-processing',
  templateUrl: './processing.component.html',
  styleUrls: ['../entry-content/_entry-content.directive.scss', './processing.component.scss']
})
export class ProcessingComponent extends EntryContentDirective<Processing> implements OnInit {

  static CONTEXT = 'processing-form';
  readonly PURPOSES = PROCESSING_PURPOSES;
  readonly RETENTION_UNITS = RETENTION_UNITS;

  availablePreferences: ModelEntryDto[];

  constructor(
      private fb: FormBuilder,
      modelsResourceService: ModelsResourceService,
      alertService: AlertService,
      sanitizer: DomSanitizer) {
    super(ProcessingComponent.CONTEXT, modelsResourceService, alertService, sanitizer);
  }

  get type(): ModelDataType {
    return 'processing';
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.modelsResourceService.listEntries({
      types: ['preference'],
      size: -1
    }).subscribe((entries) => this.availablePreferences = entries.values);
  }

  protected initForm(): void {
    this.form = this.fb.group({
      type: [this.type, [Validators.required]],
      title: ['', [Validators.required]],
      data: ['', [Validators.required]],
      retentionLabel: ['', [Validators.required]],
      retentionValue: [0, [Validators.required, Validators.min(1)]],
      retentionUnit: [RetentionUnit.YEAR, [Validators.required]],
      usage: ['', [Validators.required]],
      purposes: [[], [Validators.required]],
      containsSensitiveData: [false],
      containsMedicalData: [false],
      dataController: this.fb.group({
        actingBehalfCompany: [false],
        company: [''],
        name: [''],
        address: [''],
        email: ['', Validators.email],
        phoneNumber: ['', Validators.pattern(FIELD_VALIDATORS.phone.pattern)]
      }),
      showDataController: [{value: false, disabled: true}],
      thirdParties: this.fb.array([]),
      associatedWithPreferences: [false, [Validators.required]],
      associatedPreferences: [[]]
    });
    this.checkFormState();
  }

  registerFormChanges(): void {
    this.form.get('dataController').valueChanges.subscribe(v => this.dataControllerChange(v));
    this.form.get('associatedWithPreferences').valueChanges.subscribe(v => {
      if (v) {
        this.form.get('associatedPreferences').setValidators([Validators.required]);
      } else {
        this.form.get('associatedPreferences').clearValidators();
        this.form.get('associatedPreferences').setValue([]);
      }
    });
    super.registerFormChanges();
  }

  protected setVersion(version: ModelVersionDto<Processing>, language?: string): void {
    if (language == null) {
      language = version.defaultLanguage;
    }
    this.form.setControl('thirdParties', this.fb.array([]));
    version.data[language].thirdParties.forEach(tp => this.addThirdParty());
    super.setVersion(version, language);
  }

  restoreFormArray(controlName: string, state: any[]): void {
    if (controlName === 'thirdParties') {
      state.forEach(() => this.addThirdParty());
      this.getThirdParties().setValue(state);
    }
  }

  getThirdParties(): FormArray {
    return this.form.controls.thirdParties as FormArray;
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
    if (this.isDataControllerEmpty(dataController)) {
      this.form.get('showDataController').setValue(false);
      this.form.get('showDataController').disable();
    } else {
      this.form.get('showDataController').enable();
    }
  }

  private isDataControllerEmpty(dataController: Controller): boolean {
    if (this.form.contains('dataController')) {
      return !['company', 'name', 'address', 'email', 'phoneNumber']
        .some(k => dataController[k] != null && dataController[k].length > 0);
    }
    return true;
  }

}
