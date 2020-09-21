import { Component, OnInit } from '@angular/core';
import { EntryContentDirective } from '../entry-content/entry-content.directive';
import { Header, ModelDataType, ModelVersionDto } from '../models';
import { FormBuilder, Validators } from '@angular/forms';
import { ModelsResourceService } from '../models-resource.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LANGUAGES } from '../common/constants';
import { TranslateService } from '@ngx-translate/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['../entry-content/_entry-content.directive.scss', './header.component.scss']
})
export class HeaderComponent extends EntryContentDirective<Header> implements OnInit {

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
    return 'header';
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  protected initForm(): void {
    this.form = this.fb.group({
      type: [this.type, [Validators.required]],
      locale: ['', [Validators.required]],
      logoPath: [''],
      logoAltText: [''],
      title: ['', [Validators.required]],
      body: ['', [Validators.required]],
      jurisdiction: [''],
      showJurisdiction: [false],
      collectionMethod: [''],
      showCollectionMethod: [false],
      dataController: this.fb.group({
        actingBehalfCompany: [false],
        company: [''],
        name: [''],
        address: [''],
        email: ['', [Validators.email]],
        phoneNumber: ['']
      }),
      showDataController: [false],
      scope: [''],
      showScope: [false],
      shortNoticeLink: [''],
      showShortNoticeLink: [false],
      privacyPolicyUrl: ['', [Validators.required]],
      customPrivacyPolicyText: ['']
    });
    this.form.get('showDataController').disable();
    this.form.get('showJurisdiction').disable();
    this.form.get('showCollectionMethod').disable();
    this.form.get('showScope').disable();
    this.form.get('showShortNoticeLink').disable();
    this.initPreview();
  }

  protected loadVersion(version: ModelVersionDto<Header>, locale: string = this.version.defaultLocale): void {
    super.loadVersion(version, locale);

    if (!this.isDataControllerEmpty()) {
      this.form.get('showDataController').enable();
    }
    this.optionalFieldChange(this.form.get('jurisdiction').value, 'showJurisdiction');
    this.optionalFieldChange(this.form.get('collectionMethod').value, 'showCollectionMethod');
    this.optionalFieldChange(this.form.get('scope').value, 'showScope');
    this.optionalFieldChange(this.form.get('shortNoticeLink').value, 'showShortNoticeLink');
  }

  optionalFieldChange(event, displayField): void {
    if (event.length > 0) {
      this.form.get(displayField).enable();
    } else {
      this.form.get(displayField).setValue(false);
      this.form.get(displayField).disable();
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
