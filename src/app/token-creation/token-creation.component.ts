import { Component, OnInit } from '@angular/core';
import {
  ConsentContext,
  ConsentFormOrientation,
  ConsentFormType,
  ReceiptDeliveryType
} from '../models';
import { ConsentsResourceService } from '../consents-resource.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-token-creation',
  templateUrl: './token-creation.component.html',
  styleUrls: ['../entry-content/_entry-content.directive.scss', './token-creation.component.scss']
})
export class TokenCreationComponent implements OnInit {

  public subject = '';
  public owner = '';
  public vertical = true;
  public headerKey = '';
  public treatmentsKeys = '';
  public footerKey = '';
  public validity = '';
  public locale = '';
  public fullReceipt = true;
  public optoutEmail = '';
  public preview = true;

  public formUrl: SafeResourceUrl;

  public token = '';

  constructor(private consentsResource: ConsentsResourceService, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
  }

  generateToken(): void {
    const context: ConsentContext = {
      owner: '', // géré côté backend
      subject: this.subject,
      orientation: this.vertical ? ConsentFormOrientation.VERTICAL : ConsentFormOrientation.HORIZONTAL,
      header: this.headerKey,
      elements: this.treatmentsKeys.split(','),
      footer: this.footerKey,
      callback: '',
      validity: this.validity,
      locale: this.locale,
      formType: this.fullReceipt ? ConsentFormType.FULL : ConsentFormType.PARTIAL,
      receiptDeliveryType: ReceiptDeliveryType.DISPLAY,
      userinfos: {},
      attributes: {},
      optoutEmail: this.optoutEmail,
      preview: this.preview,
      iframe: true
    };
    this.consentsResource.generateToken(context).subscribe(response => {
      this.token = response;
    });
  }

  updateIframe(): void {
    if (this.token.length > 0) {
      this.formUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.consentsResource.getFormUrl(this.token));
    } else {
      this.formUrl = null;
    }
  }
}
