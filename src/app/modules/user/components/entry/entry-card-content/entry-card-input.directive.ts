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
import { FormControl } from '@angular/forms';
import { ConsentOrigin, FormLayoutOrientation, ModelData, ModelVersionDto } from '@fairandsmart/consents-ce/models';
import { catchError, mergeMap, tap } from 'rxjs/operators';
import { EMPTY, Observable, throwError } from 'rxjs';
import {
  Confirmation,
  ConsentContext,
  createTransactionJson,
  postSubmissionValuesHtml
} from '@fairandsmart/consents-ce/consents';
import { TranslateService } from '@ngx-translate/core';
import { KeycloakService } from 'keycloak-angular';
import { AlertService } from '../../../../../core/services/alert.service';
import { ConfigService } from '../../../../../core/services/config.service';

@Directive()
export abstract class EntryCardInputDirective<T extends ModelData> implements OnInit {

  protected readonly defaultLanguage;

  @Input()
  refusable: boolean;

  @Input()
  recordValue: string;

  @Input()
  autoSave: boolean;

  @Input()
  object: string;

  @Input()
  infoKey: string;

  @Input()
  entryKey: string;

  @Input()
  version: ModelVersionDto;

  @Output()
  changed: EventEmitter<void>;

  disabled: boolean;

  control: FormControl;

  get hasUnsavedChange(): boolean {
    if (this.autoSave) {
      return false;
    }
    if (this.recordValue === undefined) {
      const newValue = this.serializeValue();
      return (typeof newValue === 'object' && newValue !== null) || (typeof newValue === 'string' && newValue.length > 0);
    } else {
      return this.recordValue !== this.serializeValue();
    }
  }

  protected constructor(
    protected translate: TranslateService,
    protected keycloakService: KeycloakService,
    protected alertService: AlertService,
    protected configService: ConfigService
  ) {
    this.defaultLanguage = this.configService.getDefaultLanguage();
    this.changed = new EventEmitter<void>();
  }

  ngOnInit(): void {
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
      return this.version.data[this.translate.currentLang] as T;
    } else {
      return this.version.data[this.defaultLanguage] as T;
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
    if (this.recordValue === newValue) {
      return;
    }
    this.disableControl();
    const context: ConsentContext = {
      subject: this.keycloakService.getUsername(),
      object: this.object,
      callback: '',
      validity: '',
      language: this.defaultLanguage,
      subjectInfos: {},
      attributes: {},
      origin: ConsentOrigin.USER,
      author: this.keycloakService.getUsername(),
      confirmation: Confirmation.NONE,
      notification: '',
      theme: '',
      layoutData: {
        type: 'layout',
        orientation: FormLayoutOrientation.VERTICAL,
        info: this.infoKey,
        elements: [this.entryKey],
        existingElementsVisible: true,
        includeIFrameResizer: true,
      }
    };

    return createTransactionJson(context, this.translate.currentLang).pipe(
      mergeMap((url) => {
        const values = {};
        values[this.version.identifier] = newValue;
        const txid = url.split('?')[0].split('/').pop();
        return postSubmissionValuesHtml(txid, values);
      }),
      tap(() => {
        this.recordValue = newValue;
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
