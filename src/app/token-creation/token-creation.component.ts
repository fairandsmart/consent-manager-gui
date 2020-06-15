import { Component, OnInit } from '@angular/core';
import {
  ConsentContext,
  ConsentFormOrientation,
  ConsentFormType,
  CollectionMethod,
  RECEIPT_DELIVERY_TYPES,
  FIELD_VALIDATORS
} from '../models';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConsentsResourceService } from '../consents-resource.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-token-creation',
  templateUrl: './token-creation.component.html',
  styleUrls: ['../entry-content/_entry-content.directive.scss', './token-creation.component.scss']
})
export class TokenCreationComponent implements OnInit {

  public form: FormGroup;

  readonly TYPES = RECEIPT_DELIVERY_TYPES;

  public formUrl: SafeResourceUrl;

  public token = '';

  public submitText = "Generate form";

  constructor(private consentsResource: ConsentsResourceService,
              private fb: FormBuilder,
              private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      subject: ['', [
        Validators.required
      ]],
      vertical: [true, [
        Validators.required
      ]],
      headerKey: ['', [
        Validators.required,
        Validators.pattern(FIELD_VALIDATORS.key.pattern)
      ]],
      elementsKeys: ['', [
        Validators.required,
        Validators.pattern(FIELD_VALIDATORS.elementsKeys.pattern)
      ]],
      footerKey: ['', [
        Validators.required,
        Validators.pattern(FIELD_VALIDATORS.key.pattern)
      ]],
      validity: ['', []],
      receiptType: ['', [
        Validators.required
      ]],
      locale: ['', [
        Validators.required
      ]],
      forceDisplay: [true, [
        Validators.required
      ]],
      optoutEmail: ['', [
        Validators.required
      ]],
      preview: [true, [
        Validators.required
      ]]
    });
    this.form.enable();
  }

  submit(): void {
    if (this.form.valid) {
      this.form.disable();
      const formValue = this.form.getRawValue();
      const context: ConsentContext = {
        owner: '', // géré côté backend
        subject: formValue.subject,
        orientation: formValue.vertical ? ConsentFormOrientation.VERTICAL : ConsentFormOrientation.HORIZONTAL,
        header: formValue.headerKey,
        elements: formValue.elementsKeys.split(','),
        footer: formValue.footerKey,
        callback: '',
        validity: formValue.validity,
        locale: formValue.locale,
        formType: formValue.forceDisplay ? ConsentFormType.FULL : ConsentFormType.PARTIAL,
        receiptDeliveryType: formValue.receiptType,
        userinfos: {},
        attributes: {},
        optoutEmail: formValue.optoutEmail,
        collectionMethod: CollectionMethod.WEBFORM,
        author: '',
        preview: formValue.preview,
        iframe: true
      };
      this.consentsResource.generateToken(context).subscribe((token) => {
        this.token = token;
        this.formUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.consentsResource.getFormUrl(this.token));
        this.submitText = "Update form";
        this.form.enable();
      }, (err) => {
        console.error(err);
        this.form.enable();
        this.token = "";
        this.formUrl = "";
      });
    }
  }
}
