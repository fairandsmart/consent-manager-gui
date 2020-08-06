import { Component, OnInit } from '@angular/core';
import { EntryContentDirective } from '../entry-content/entry-content.directive';
import { ModelVersion, Treatment, TREATMENT_PURPOSES } from '../models';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { ModelsResourceService } from '../models-resource.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LANGUAGES } from '../common/constants';
import { TranslateService } from '@ngx-translate/core';

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
      translateService: TranslateService) {
    super(modelsResourceService, snackBar, translateService);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  protected initForm(): void {
    this.form = this.fb.group({
      type: ['treatment', [Validators.required]],
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
        email: [''],
        phoneNumber: ['']
      }),
      showDataController: [false],
      thirdParties: this.fb.array([])
    });
    this.form.get('showDataController').disable();
  }

  protected loadVersion(version: ModelVersion<Treatment>, locale: string = this.version.defaultLocale): void {
    const localeContent = version.content[locale].dataObject;
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

  private isDataControllerEmpty(): boolean {
    const keys = ['company', 'name', 'address', 'email', 'phoneNumber'];
    let empty = true;
    let keyIndex = 0;
    while (empty && keyIndex < keys.length) {
      empty = this.form.get('dataController').get(keys[keyIndex]).value.length === 0;
      keyIndex++;
    }
    return empty;
  }
}
