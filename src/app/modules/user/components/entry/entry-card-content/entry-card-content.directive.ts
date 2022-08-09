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
import { Directive, EventEmitter, Input, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { KeycloakService } from 'keycloak-angular';
import { AlertService } from '../../../../../core/services/alert.service';
import { ConfigService } from '../../../../../core/services/config.service';
import {
  ModelData,
  ModelEntryDto,
  ModelVersionDto
} from '@fairandsmart/consents-ce/models';
import { RECORD_IDENTIFIER_DEFAULT, RecordDto } from '@fairandsmart/consents-ce/records';
import { EntryCardInputDirective } from './entry-card-input.directive';

@Directive()
export abstract class EntryCardContentDirective<T extends ModelData> implements OnInit {

  private readonly defaultLanguage;

  @ViewChildren(EntryCardInputDirective)
  itemInputs: QueryList<EntryCardInputDirective<T>>;

  @Input()
  entry: ModelEntryDto;

  @Input()
  info: ModelEntryDto;

  @Input()
  version: ModelVersionDto<T>;

  @Input()
  recordsMap: { [key: string]: RecordDto };

  @Input()
  autoSave: boolean;

  @Output()
  changed: EventEmitter<void>;

  data: T;
  recordsKeys: string[] = [];

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
    if (!(RECORD_IDENTIFIER_DEFAULT in this.recordsMap)) {
      this.recordsMap[RECORD_IDENTIFIER_DEFAULT] = {
        bodyKey: '',
        comment: '',
        creationTimestamp: 0,
        expirationTimestamp: 0,
        notificationReports: [],
        origin: '',
        serial: '',
        status: undefined,
        statusExplanation: undefined,
        subject: '',
        transaction: '',
        type: '',
        value: ''
      };
    }
    this.recordsKeys = Object.keys(this.recordsMap).sort((a, b) =>
      a === RECORD_IDENTIFIER_DEFAULT ? -1 : b === RECORD_IDENTIFIER_DEFAULT ? 1 : a.localeCompare(b));
  }

  notifyUnsavedChanges(): void {
    if (!this.autoSave) {
      this.changed.emit();
    }
  }

  getData(): T {
    if (this.version.data[this.translate.currentLang]) {
      return this.version.data[this.translate.currentLang];
    } else {
      return this.version.data[this.defaultLanguage];
    }
  }
}
