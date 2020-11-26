import { Component, OnInit } from '@angular/core';
import { EntryContentDirective } from '../entry-content/entry-content.directive';
import { BasicInfo, Controller, FIELD_VALIDATORS, ModelDataType } from '../../../../../core/models/models';
import { FormBuilder, Validators } from '@angular/forms';
import { ModelsResourceService } from '../../../../../core/http/models-resource.service';
import { DomSanitizer } from '@angular/platform-browser';
import { AlertService } from '../../../../../core/services/alert.service';

@Component({
  selector: 'cm-basicinfo',
  templateUrl: './basicinfo.component.html',
  styleUrls: ['../entry-content/_entry-content.directive.scss', './basicinfo.component.scss']
})
export class BasicinfoComponent extends EntryContentDirective<BasicInfo> implements OnInit {

  static CONTEXT = 'Basic-Info';

  constructor(
    private fb: FormBuilder,
    modelsResourceService: ModelsResourceService,
    alertService: AlertService,
    sanitizer: DomSanitizer) {
    super(BasicinfoComponent.CONTEXT, modelsResourceService, alertService, sanitizer);
  }

  get type(): ModelDataType {
    return 'basicinfo';
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
      header: [''],
      footer: [''],
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
    this.checkFormState();
  }

  registerFormChanges(): void {
    this.form.get('jurisdiction').valueChanges.subscribe(v => this.optionalFieldChange(v, 'showJurisdiction'));
    this.form.get('collectionMethod').valueChanges.subscribe(v => this.optionalFieldChange(v, 'showCollectionMethod'));
    this.form.get('scope').valueChanges.subscribe(v => this.optionalFieldChange(v, 'showScope'));
    this.form.get('shortNoticeLink').valueChanges.subscribe(v => this.optionalFieldChange(v, 'showShortNoticeLink'));
    this.form.get('dataController').valueChanges.subscribe(v => this.dataControllerChange(v));
    super.registerFormChanges();
  }

  private optionalFieldChange(value: string, linkedControllerName: keyof BasicInfo): void {
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
        .some(k => dataController[k] != null && dataController[k].length > 0);
    }
    return true;
  }

}
