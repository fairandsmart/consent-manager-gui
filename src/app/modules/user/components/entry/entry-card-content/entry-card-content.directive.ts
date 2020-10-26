import { Directive, Input, OnInit } from '@angular/core';
import {
  CollectionMethod,
  ConsentContext,
  ConsentFormOrientation,
  ConsentFormType,
  ModelData,
  ModelEntryDto,
  ModelVersionDto,
  RecordDto
} from '../../../../../core/models/models';
import { TranslateService } from '@ngx-translate/core';
import { catchError, mergeMap, tap } from 'rxjs/operators';
import { HttpParams } from '@angular/common/http';
import { EMPTY } from 'rxjs';
import { KeycloakService } from 'keycloak-angular';
import { ConsentsResourceService } from '../../../../../core/http/consents-resource.service';
import { AlertService } from '../../../../../core/services/alert.service';
import { FormControl } from '@angular/forms';

@Directive()
export abstract class EntryCardContentDirective<T extends ModelData> implements OnInit {

  @Input()
  entry: ModelEntryDto;

  @Input()
  version: ModelVersionDto<T>;

  @Input()
  record: RecordDto;

  remoteValue: string;

  control: FormControl;

  protected constructor(
    protected translate: TranslateService,
    protected keycloakService: KeycloakService,
    protected consentsResourceService: ConsentsResourceService,
    protected alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.remoteValue = this.record?.value;
    const state = this.parseValue();
    this.control = new FormControl(state);
    this.control.valueChanges.subscribe(e => {
      this.saveChanges();
    });
  }

  abstract parseValue(): any;
  abstract serializeValue(): string;

  getData(): T {
    return this.version.data[this.translate.currentLang];
  }

  protected enableControl(): void {
    this.control.enable({emitEvent: false});
  }

  protected disableControl(): void {
    this.control.disable({emitEvent: false});
  }

  protected saveChanges(): void {
    const newValue = this.serializeValue();
    if (this.remoteValue === newValue) {
      return;
    }
    this.disableControl();
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
        this.alertService.success('USER.SAVE.SUCCESS');
        this.remoteValue = newValue;
        this.enableControl();
      }),
      catchError((err) => {
        this.alertService.error('USER.SAVE.ERROR', err);
        // TODO revert to remoteValue state
        return EMPTY;
      })
    ).subscribe();
  }

}
