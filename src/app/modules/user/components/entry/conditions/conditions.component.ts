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
import { Component, OnInit } from '@angular/core';
import { EntryCardContentDirective } from '../entry-card-content/entry-card-content.directive';
import { Conditions } from '../../../../../core/models/models';
import { TranslateService } from '@ngx-translate/core';
import { KeycloakService } from 'keycloak-angular';
import { ConsentsResourceService } from '../../../../../core/http/consents-resource.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AlertService } from '../../../../../core/services/alert.service';
import { ConfigService } from '../../../../../core/services/config.service';
import { CoreService } from '../../../../../core/services/core.service';

@Component({
  selector: 'cm-conditions-user',
  templateUrl: './conditions.component.html',
  styleUrls: ['../entry-card/entry-card.component.scss', './conditions.component.scss']
})
export class ConditionsComponent extends EntryCardContentDirective<Conditions> implements OnInit {

  showDetails: boolean;

  get body(): SafeHtml {
    if (this.getData()?.body) {
      return this.sanitizer.bypassSecurityTrustHtml(this.getData().body);
    } else {
      return '';
    }
  }

  constructor(
    translate: TranslateService,
    keycloakService: KeycloakService,
    consentsResourceService: ConsentsResourceService,
    alertService: AlertService,
    private sanitizer: DomSanitizer,
    configService: ConfigService,
    coreService: CoreService
  ) {
    super(translate, keycloakService, consentsResourceService, alertService, configService, coreService);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  enableControl(): void {
    if (this.remoteValue === 'accepted') {
      return;
    }
    this.control.enable({emitEvent: false});
  }

  parseValue(): any {
    const isAccepted = this.remoteValue === 'accepted';
    return {
      value: isAccepted,
      disabled: isAccepted
    };
  }

  serializeValue(): string {
    return this.control.value ? 'accepted' : 'refused';
  }
}
