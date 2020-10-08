import { Component, OnInit } from '@angular/core';
import { EntryContentDirective } from '../entry-content/entry-content.directive';
import {
  Controller,
  FIELD_VALIDATORS,
  ModelDataType,
  ModelVersionDto,
  Treatment,
  TREATMENT_PURPOSES,
  TreatmentPurpose
} from '../../../../../core/models/models';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { ModelsResourceService } from '../../../../../core/http/models-resource.service';
import { DomSanitizer } from '@angular/platform-browser';
import { AlertService } from '../../../../../core/services/alert.service';

@Component({
  selector: 'app-treatment',
  templateUrl: './treatment.component.html',
  styleUrls: ['../entry-content/_entry-content.directive.scss', './treatment.component.scss']
})
export class TreatmentComponent extends EntryContentDirective<Treatment> implements OnInit {

  readonly PURPOSES = TREATMENT_PURPOSES;

  constructor(
      private fb: FormBuilder,
      modelsResourceService: ModelsResourceService,
      alertService: AlertService,
      sanitizer: DomSanitizer) {
    super(modelsResourceService, alertService, sanitizer);
  }

  get type(): ModelDataType {
    return 'treatment';
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  protected initForm(): void {
    this.form = this.fb.group({
      type: [this.type, [Validators.required]],
      treatmentTitle: ['', [Validators.required]],
      dataTitle: [''],
      dataBody: ['', [Validators.required]],
      retentionTitle: [''],
      retentionBody: ['', [Validators.required]],
      usageTitle: [''],
      usageBody: ['', [Validators.required]],
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
      thirdParties: this.fb.array([])
    });

    this.form.get('dataController').valueChanges.subscribe(v => this.dataControllerChange(v));

    this.initPreview();
  }

  protected setVersion(version: ModelVersionDto<Treatment>, locale: string = this.version.defaultLocale): void {
    this.form.setControl('thirdParties', this.fb.array([]));
    version.data[locale].thirdParties.forEach(tp => this.addThirdParty());
    super.setVersion(version, locale);
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

  purposesChange(purposes: TreatmentPurpose[]): void {
    if (!purposes.includes(TreatmentPurpose.CONSENT_THIRD_PART_SHARING)) {
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
        .some(k => dataController[k].length > 0);
    }
    return true;
  }

}
