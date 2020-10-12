import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConsentsResourceService } from '../core/http/consents-resource.service';
import { ActivatedRoute } from '@angular/router';
import { CollectionMethod, ConsentContext, ConsentFormOrientation, ConsentFormType } from '../core/models/models';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { combineLatest, EMPTY, Subscription } from 'rxjs';
import { catchError, mergeMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-conditions-read-only',
  templateUrl: './conditions-read-only.component.html',
  styleUrls: ['./conditions-read-only.component.scss']
})
export class ConditionsReadOnlyComponent implements OnInit, OnDestroy {

  public conditionsUrl: SafeResourceUrl;

  private subs: Subscription[] = [];

  constructor(
    private route: ActivatedRoute,
    private consentsResource: ConsentsResourceService,
    private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.subs.push(
      combineLatest([
        this.route.paramMap,
        this.route.queryParamMap
      ]).pipe(
        mergeMap(([params, queryParams]) => {
          const context: ConsentContext = {
            subject: '',
            orientation: ConsentFormOrientation.VERTICAL,
            info: '',
            elements: [params.get('key')],
            callback: '',
            validity: '',
            locale: queryParams.get('lang') ? queryParams.get('lang') : 'en',
            formType: ConsentFormType.FULL,
            receiptDeliveryType: 'NONE',
            userinfos: {},
            attributes: {},
            optoutModel: '',
            optoutRecipient: '',
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
        catchError((err) => {
          console.error(err);
          return EMPTY;
        })
      ).subscribe()
    );
  }

  ngOnDestroy(): void {
    this.subs?.forEach(s => s.unsubscribe());
  }

}
