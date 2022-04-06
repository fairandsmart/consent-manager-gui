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
import { Directive, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { catchError, mergeMap, tap } from 'rxjs/operators';
import { EMPTY, Observable, throwError } from 'rxjs';
import { KeycloakService } from 'keycloak-angular';
import { AlertService } from '../../../../../core/services/alert.service';
import { FormControl } from '@angular/forms';
import { ConfigService } from '../../../../../core/services/config.service';
import { CoreService } from '../../../../../core/services/core.service';
import * as _ from 'lodash';
import {
  ConsentOrigin,
  FormLayoutOrientation,
  ModelData,
  ModelEntryDto,
  ModelVersionDto
} from '@fairandsmart/consents-ce/models';
import { RecordDto } from '@fairandsmart/consents-ce/records';
import {
  Confirmation,
  ConsentContext,
  createTransactionJson,
  postSubmissionValuesHtml
} from '@fairandsmart/consents-ce/consents';

@Directive()
export abstract class EntryCardContentDirective<T extends ModelData> implements OnInit {

  private readonly defaultLanguage;

  @Input()
  entry: ModelEntryDto;

  @Input()
  info: ModelEntryDto;

  @Input()
  version: ModelVersionDto<T>;

  @Input()
  record: RecordDto;

  remoteValue: string;

  control: FormControl;

  @Input()
  autoSave: boolean;

  @Output()
  changed: EventEmitter<void>;

  get hasUnsavedChange(): boolean {
    if (this.autoSave) {
      return false;
    }
    if (this.remoteValue === undefined) {
      const newValue = this.serializeValue();
      return (typeof newValue === 'object' && newValue !== null) || (typeof newValue === 'string' && newValue.length > 0);
    } else {
      return this.remoteValue !== this.serializeValue();
    }
  }

  protected constructor(
    protected translate: TranslateService,
    protected keycloakService: KeycloakService,
    protected alertService: AlertService,
    protected configService: ConfigService,
    protected coreService: CoreService
  ) {
    this.defaultLanguage = this.configService.getDefaultLanguage();
    this.changed = new EventEmitter<void>();
  }

  ngOnInit(): void {
    this.remoteValue = this.record?.value;
    const state = this.parseValue();
    this.control = new FormControl(state);
    this.control.valueChanges.subscribe(() => {
      this.changed.emit();
      if (this.autoSave) {
        this.doAutoSave();
      }
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

  public resetState(): void {
    const state = this.parseValue();
    this.control.setValue(state, {emitEvent: false});
  }

  protected enableControl(): void {
    this.control.enable({emitEvent: false});
  }

  protected disableControl(): void {
    this.control.disable({emitEvent: false});
  }

  protected doAutoSave(): void {
    this.saveChanges().pipe(
      tap(() => {
        // Success
        this.alertService.success('USER.SAVE.SUCCESS');
      }),
      catchError((err) => {
        this.alertService.error('USER.SAVE.ERROR', err);
        return EMPTY;
      })
    ).subscribe();
  }

  public saveChanges(): Observable<string> {
    const newValue = this.serializeValue();
    if (this.remoteValue === newValue) {
      return;
    }
    if (this.coreService.hasActiveInfo === false) {
      this.alertService.error(this.translate.instant('ALERT.NO_INFORMATION_USER'), new Error('No info'));
      this.resetState();
      return;
    }
    this.disableControl();
    const element = _.last(this.entry.versions);
    const context: ConsentContext = {
      subject: this.keycloakService.getUsername(),
      callback: '',
      validity: '',
      language: this.defaultLanguage,
      userinfos: {},
      attributes: {},
      origin: ConsentOrigin.USER,
      author: this.keycloakService.getUsername(),
      confirmation: Confirmation.NONE,
      notification: '',
      theme: '',
      layoutData: {
        type: 'layout',
        orientation: FormLayoutOrientation.VERTICAL,
        info: this.info ? this.info.key : '',
        elements: [this.entry.key],
        existingElementsVisible: true,
        includeIFrameResizer: true,
      }
    };

    return createTransactionJson(context, this.translate.currentLang).pipe(
      mergeMap((url) => {
        const values = {};
        values[element.identifier] = newValue;
        const txid = url.split('?')[0].split('/').pop();
        return postSubmissionValuesHtml(txid, values);
      }),
      tap(() => {
        this.remoteValue = newValue;
        this.enableControl();
      }),
      catchError((err) => {
        this.resetState();
        this.enableControl();
        return throwError(err);
      })
    );
  }

}
