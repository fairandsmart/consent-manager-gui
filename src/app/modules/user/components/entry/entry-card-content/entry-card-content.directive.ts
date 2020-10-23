import { Directive, Input, OnInit } from '@angular/core';
import {
  CollectionMethod,
  ConsentContext, ConsentFormOrientation, ConsentFormType,
  ModelData,
  ModelEntryDto,
  ModelVersionDto,
  RecordDto
} from '../../../../../core/models/models';
import { TranslateService } from '@ngx-translate/core';
import { catchError, mergeMap, tap } from 'rxjs/operators';
import { HttpParams } from '@angular/common/http';
import { throwError } from 'rxjs';
import { KeycloakService } from 'keycloak-angular';
import { ConsentsResourceService } from '../../../../../core/http/consents-resource.service';

@Directive()
export abstract class EntryCardContentDirective<T extends ModelData, U = string> implements OnInit {

  @Input()
  entry: ModelEntryDto;

  @Input()
  version: ModelVersionDto<T>;

  @Input()
  record: RecordDto;

  remoteValue: string;
  value: U;
  loading: boolean;

  protected constructor(
    protected translate: TranslateService,
    protected keycloakService: KeycloakService,
    protected consentsResourceService: ConsentsResourceService
  ) {}

  ngOnInit(): void {
    if (this.record) {
      this.value = this.parseValue();
    }
  }

  abstract parseValue(): U;
  abstract serializeValue(): string;
  saved(err?: Error): void {};

  getData(): T {
    return this.version.data[this.translate.currentLang];
  }

  saveChanges(): void {
    this.loading = true;
    if (this.record) {
      this.remoteValue = this.record.value;
    }
    const newValue = this.serializeValue();
    const element = `element/${this.entry.type}/${this.entry.key}/${this.entry.versions[this.entry.versions.length - 1].serial}`;
    const context: ConsentContext = {
      subject: this.keycloakService.getUsername(),
      orientation: ConsentFormOrientation.VERTICAL,
      info: '',
      elements: [element],
      callback: '',
      validity: '',
      locale: this.translate.currentLang,
      formType: ConsentFormType.FULL,
      receiptDeliveryType: 'STORE', // TODO revert to 'NONE',
      userinfos: {},
      attributes: {},
      optoutModel: '',
      optoutRecipient: '',
      collectionMethod: CollectionMethod.WEBFORM,
      author: this.keycloakService.getUsername(),
      preview: false,
      iframe: true,
      conditions: true,
      theme: ''
    };
    this.consentsResourceService.generateToken(context).pipe(
      mergeMap((token) => {
        const params: HttpParams = new HttpParams()
          .append('token', token)
          .append(element, newValue);
        return this.consentsResourceService.postConsent(params);
      }),
      tap(() => {
        // Success
        this.loading = false;
        this.remoteValue = newValue;
        if (!!this.saved) { this.saved(); }
      }),
      catchError((err) => {
        // TODO display alert, revert to visual initial state
        this.value = this.parseValue();
        this.loading = false;
        if (!!this.saved) { this.saved(err); }
        return throwError(err);
      })
    ).subscribe();
  }

}
