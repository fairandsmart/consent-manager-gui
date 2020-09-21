import { Component, OnInit } from '@angular/core';
import { EntryContentDirective } from '../entry-content/entry-content.directive';
import { ModelDataType, ModelVersionDto, Treatment, TREATMENT_PURPOSES } from '../models';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { ModelsResourceService } from '../models-resource.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LANGUAGES } from '../common/constants';
import { TranslateService } from '@ngx-translate/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-treatment',
  templateUrl: './treatment.component.html',
  styleUrls: ['../entry-content/_entry-content.directive.scss', './treatment.component.scss']
})
export class TreatmentComponent extends EntryContentDirective<Treatment> implements OnInit {

  readonly PURPOSES = TREATMENT_PURPOSES;
  readonly LANGUAGES = LANGUAGES;

  constructor(
      private fb: FormBuilder,
      modelsResourceService: ModelsResourceService,
      snackBar: MatSnackBar,
      translateService: TranslateService,
      sanitizer: DomSanitizer) {
    super(modelsResourceService, snackBar, translateService, sanitizer);
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
      locale: ['', [Validators.required]],
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
        phoneNumber: ['']
      }),
      showDataController: [false],
      thirdParties: this.fb.array([])
    });
    this.form.get('showDataController').disable();
    this.initPreview();
  }

  protected loadVersion(version: ModelVersionDto<Treatment>, locale: string = this.version.defaultLocale): void {
    const localeContent = (version.data[locale] as Treatment);
    const localeThirdParties = localeContent.thirdParties;
    delete localeContent.thirdParties;
    this.form.patchValue(localeContent);

    if (!this.isDataControllerEmpty()) {
      this.form.get('showDataController').enable();
    }

    const thirdPartiesArray = this.fb.array([]);
    localeThirdParties.forEach(party => {
      thirdPartiesArray.push(this.fb.group({
        name: [party.name, [Validators.required]],
        value: [party.value, [Validators.required]]
      }));
    });
    this.form.setControl('thirdParties', thirdPartiesArray);

    this.initialValue = this.form.getRawValue();
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

  removeThirdParty(index): void {
    this.getThirdParties().removeAt(index);
  }

  purposesChange(event): void {
    if (!event.includes('CONSENT_THIRD_PART_SHARING')) {
      this.getThirdParties().clear();
    }
  }

  dataControllerChange(event): void {
    if (event.length > 0) {
      this.form.get('showDataController').enable();
    } else if (this.isDataControllerEmpty()) {
      this.form.get('showDataController').setValue(false);
      this.form.get('showDataController').disable();
    }
  }

}
