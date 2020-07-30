import { Component, OnInit } from '@angular/core';
import { ConsentsResourceService } from '../consents-resource.service';
import { ActivatedRoute } from '@angular/router';
import { CollectionMethod, ConsentContext, ConsentFormOrientation, ConsentFormType } from '../models';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { combineLatest, EMPTY } from 'rxjs';
import { catchError, mergeMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-conditions-read-only',
  templateUrl: './conditions-read-only.component.html',
  styleUrls: ['./conditions-read-only.component.scss']
})
export class ConditionsReadOnlyComponent implements OnInit {

  public conditionsUrl: SafeResourceUrl;

  constructor(
    private activatedRoute: ActivatedRoute,
    private consentsResource: ConsentsResourceService,
    private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    combineLatest([
      this.activatedRoute.paramMap,
      this.activatedRoute.queryParamMap
    ]).pipe(
      mergeMap(([params, queryParams]) => {
        const context: ConsentContext = {
          owner: params.get('owner'),
          subject: '',
          orientation: ConsentFormOrientation.VERTICAL,
          header: '',
          elements: [params.get('key')],
          footer: '',
          callback: '',
          validity: '',
          locale: queryParams.get('lang') ? queryParams.get('lang') : 'en',
          formType: ConsentFormType.FULL,
          receiptDeliveryType: 'NONE',
          userinfos: {},
          attributes: {},
          optoutEmail: '',
          collectionMethod: CollectionMethod.WEBFORM,
          author: '',
          preview: true,
          iframe: true,
          conditions: true,
          theme: ''
        };
        return this.consentsResource.generateToken(context);
      }),
      tap((token) => {
        this.conditionsUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.consentsResource.getFormUrl(token));
      }),
      catchError((error) => {
        console.error(error);
        return EMPTY;
      })
    ).subscribe();
  }

}