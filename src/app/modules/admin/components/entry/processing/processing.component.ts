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
import {TranslateService} from '@ngx-translate/core';
import {ConfigService} from '../../../../../core/services/config.service';

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
      sanitizer: DomSanitizer,
      private translate: TranslateService,
      configService: ConfigService) {
    super(ProcessingComponent.CONTEXT, modelsResourceService, alertService, sanitizer, configService);
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
    this.form.get('containsMedicalData').disable();
    this.form.get('dataControllerVisible').disable();
    this.form.get('retention').valueChanges.subscribe((value) => {
      this.form.get('retention').get('fullText')
        .patchValue(`${value.label} ${value.value} ${this.translate.instant('ENTRIES.EDITOR.PROCESSING.RETENTION.UNIT.VALUES.' + value.unit)}`, { emitEvent: false });
    });
    this.checkFormState();
  }

  registerFormChanges(): void {
    this.form.get('containsSensitiveData').valueChanges.subscribe(v => {
      if (v) {
        this.form.get('containsMedicalData').enable();
      } else {
        this.form.get('containsMedicalData').disable();
        this.form.get('containsMedicalData').setValue(false);
      }
    });
    this.form.get('dataController').valueChanges.subscribe(v => this.dataControllerChange(v));
    super.registerFormChanges();
  }

  protected setVersion(version: ModelVersionDto<Processing>, language: string = version.defaultLanguage): void {
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

}
