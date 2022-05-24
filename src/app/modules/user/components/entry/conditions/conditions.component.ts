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
import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { EntryCardContentDirective } from '../entry-card-content/entry-card-content.directive';
import { Conditions } from '@fairandsmart/consents-ce/models';
import { TranslateService } from '@ngx-translate/core';
import { KeycloakService } from 'keycloak-angular';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AlertService } from '../../../../../core/services/alert.service';
import { ConfigService } from '../../../../../core/services/config.service';
import { ConditionsInputComponent } from './conditions-input/conditions-input.component';

@Component({
  selector: 'cm-conditions-user',
  templateUrl: './conditions.component.html',
  styleUrls: ['../entry-card/entry-card.component.scss', './conditions.component.scss']
})
export class ConditionsComponent extends EntryCardContentDirective<Conditions> implements OnInit {

  showDetails: boolean;

  @ViewChildren(ConditionsInputComponent)
  itemInputs: QueryList<ConditionsInputComponent>;

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
    alertService: AlertService,
    configService: ConfigService,
    private sanitizer: DomSanitizer
  ) {
    super(translate, keycloakService, alertService, configService);
  }

}
