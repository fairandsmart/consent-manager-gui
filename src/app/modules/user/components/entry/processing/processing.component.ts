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
import { Processing } from '@fairandsmart/consents-ce/models';
import { TranslateService } from '@ngx-translate/core';
import { KeycloakService } from 'keycloak-angular';
import { AlertService } from '../../../../../core/services/alert.service';
import { ConfigService } from '../../../../../core/services/config.service';
import { ProcessingInputComponent } from './processing-input/processing-input.component';

@Component({
  selector: 'cm-processing-user',
  templateUrl: './processing.component.html',
  styleUrls: ['../entry-card/entry-card.component.scss', './processing.component.scss']
})
export class ProcessingComponent extends EntryCardContentDirective<Processing> implements OnInit {

  showDetails: boolean;

  @ViewChildren(ProcessingInputComponent)
  itemInputs: QueryList<ProcessingInputComponent>;

  constructor(
    translate: TranslateService,
    keycloakService: KeycloakService,
    alertService: AlertService,
    configService: ConfigService
  ) {
    super(translate, keycloakService, alertService, configService);
  }

}
