import { Component, OnInit } from '@angular/core';
import { EntryContentDirective } from '../entry-content/entry-content.directive';
import { Controller, FIELD_VALIDATORS, Header, ModelDataType } from '../../../../../core/models/models';
import { FormBuilder, Validators } from '@angular/forms';
import { ModelsResourceService } from '../../../../../core/http/models-resource.service';
import { DomSanitizer } from '@angular/platform-browser';
import { AlertService } from '../../../../../core/services/alert.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['../entry-content/_entry-content.directive.scss', './header.component.scss']
})
export class HeaderComponent extends EntryContentDirective<Header> implements OnInit {

  constructor(
    private fb: FormBuilder,
    modelsResourceService: ModelsResourceService,
    alertService: AlertService,
    sanitizer: DomSanitizer) {
    super(modelsResourceService, alertService, sanitizer);
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
      logoPath: [''],
      logoAltText: [''],
      title: ['', [Validators.required]],
      body: ['', [Validators.required]],
      jurisdiction: [''],
      showJurisdiction: [{value: false, disabled: true}],
      collectionMethod: [''],
      showCollectionMethod: [{value: false, disabled: true}],
      dataController: this.fb.group({
        actingBehalfCompany: [false],
        company: [''],
        name: [''],
        address: [''],
        email: ['', [Validators.email]],
        phoneNumber: ['', Validators.pattern(FIELD_VALIDATORS.phone.pattern)]
      }),
      showDataController: [{value: false, disabled: true}],
      scope: [''],
      showScope: [{value: false, disabled: true}],
      shortNoticeLink: [''],
      showShortNoticeLink: [{value: false, disabled: true}],
      privacyPolicyUrl: ['', [Validators.required]],
      customPrivacyPolicyText: ['']
    });

    this.form.get('jurisdiction').valueChanges.subscribe(v => this.optionalFieldChange(v, 'showJurisdiction'));
    this.form.get('collectionMethod').valueChanges.subscribe(v => this.optionalFieldChange(v, 'showCollectionMethod'));
    this.form.get('scope').valueChanges.subscribe(v => this.optionalFieldChange(v, 'showScope'));
    this.form.get('shortNoticeLink').valueChanges.subscribe(v => this.optionalFieldChange(v, 'showShortNoticeLink'));
    this.form.get('dataController').valueChanges.subscribe(v => this.dataControllerChange(v));

    this.initPreview();
  }

  private optionalFieldChange(value: string, linkedControllerName: keyof Header): void {
    if (value.length > 0) {
      this.form.get(linkedControllerName).enable();
    } else {
      this.form.get(linkedControllerName).setValue(false);
      this.form.get(linkedControllerName).disable();
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
