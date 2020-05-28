import { Component, OnInit } from '@angular/core';
import {
  ConsentContext,
  ConsentFormOrientation,
  ReceiptFormType,
  ReceiptDeliveryType
} from '../models';
import { ConsentsResourceService } from '../consents-resource.service';

@Component({
  selector: 'app-token-creation',
  templateUrl: './token-creation.component.html',
  styleUrls: ['../entry-content/_entry-content.directive.scss', './token-creation.component.scss']
})
export class TokenCreationComponent implements OnInit {

  public subject: string = "";
  public owner: string = "";
  public vertical: boolean = true;
  public headerKey: string = "";
  public treatmentsKeys: string = "";
  public footerKey: string = "";
  public locale: string = "";
  public fullReceipt: boolean = true;
  public optoutEmail: string = "";

  public token: string = "";

  constructor(private consentsResource: ConsentsResourceService) { }

  ngOnInit(): void {
  }

  generateToken(): void {
    var context: ConsentContext = {
      owner: "", // géré côté backend
      subject: this.subject,
      orientation: this.vertical ? ConsentFormOrientation.VERTICAL : ConsentFormOrientation.HORIZONTAL,
      header: this.headerKey,
      elements: this.treatmentsKeys.split(","),
      footer: this.footerKey,
      callback: "",
      locale: this.locale,
      formType: this.fullReceipt ? ReceiptFormType.FULL : ReceiptFormType.PARTIAL,
      receiptDeliveryType: ReceiptDeliveryType.DISPLAY,
      userinfos: {},
      attributes: {},
      optoutEmail: this.optoutEmail,
      preview: true,
      iframe: true
    };
    this.consentsResource.generateToken(context).subscribe(response => {
      this.token = response;
    });
  }

  updateIframe(): void {
    var container = document.getElementById("iframe-container");
    var iframe: HTMLIFrameElement = document.getElementById("form-iframe") as HTMLIFrameElement;
    if (this.token.length > 0) {
      iframe.src = this.consentsResource.getFormUrl(this.token);
      container.style.display = "block";
    } else {
      iframe.src = "";
      container.style.display = "none";
    }
  }
}
