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
import { environment } from '../../../../../../environments/environment';

@Directive()
export abstract class EntryCardContentDirective<T extends ModelData> implements OnInit {

  private readonly defaultLanguage = environment.customization.defaultLanguage;

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
    this.control.valueChanges.subscribe(() => {
      this.saveChanges();
    });
  }

  abstract parseValue(): any;
  abstract serializeValue(): string;

  getData(): T {
    if (this.version.data[this.translate.currentLang]) {
      return this.version.data[this.translate.currentLang];
    } else {
      return this.version.data[this.defaultLanguage];
    }
  }

  protected resetState(): void {
    const state = this.parseValue();
    this.control.setValue(state, {emitEvent: false});
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
    const element = this.entry.versions[this.entry.versions.length - 1].identifier;
    const context: ConsentContext = {
      subject: this.keycloakService.getUsername(),
      orientation: ConsentFormOrientation.VERTICAL,
      info: '',
      elements: [element],
      callback: '',
      validity: '',
      language: this.defaultLanguage,
      formType: ConsentFormType.FULL,
      receiptDeliveryType: 'DOWNLOAD',
      userinfos: {},
      attributes: {},
      notificationModel: '',
      notificationRecipient: '',
      collectionMethod: CollectionMethod.USER_PAGE,
      author: this.keycloakService.getUsername(),
      preview: false,
      iframe: true,
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
        this.resetState();
        this.enableControl();
        return EMPTY;
      })
    ).subscribe();
  }

}
