/*-
 * #%L
 * Right Consents, a Universal Consents & Preferences Management Platform.
 * %%
 * Copyright (C) 2020 - 2021 Fair And Smart
 * %%
 * This file is part of Right Consents Community Edition.
 * 
 * Right Consents Community Edition is published by FAIR AND SMART under the
 * GNU GENERAL PUBLIC LICENCE Version 3 (GPLv3) and a set of additional terms.
 * 
 * For more information, please see the “LICENSE” and “LICENSE.FAIRANDSMART”
 * files, or see https://www.fairandsmart.com/opensource/.
 * #L%
 */
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
import {ConfigService} from '../../../../../core/services/config.service';

@Directive()
export abstract class EntryCardContentDirective<T extends ModelData> implements OnInit {

  private readonly defaultLanguage;

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
    protected alertService: AlertService,
    protected configService: ConfigService,
  ) {
    this.defaultLanguage = this.configService.config.language;
  }

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
