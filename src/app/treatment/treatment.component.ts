import { Component, OnInit } from '@angular/core';
import { EntryContentDirective } from '../entry-content/entry-content.directive';
import { Treatment, TREATMENT_PURPOSES } from '../models';
import { FormBuilder, Validators } from '@angular/forms';
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
      treatmentTitle: [''],
      dataTitle: [''],
      dataBody: [''],
      retentionTitle: [''],
      retentionBody: [''],
      usageTitle: [''],
      usageBody: [''],
      purposes: [[]],
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
      // TODO thirdParties: this.fb.array([])
    });
  }

}
