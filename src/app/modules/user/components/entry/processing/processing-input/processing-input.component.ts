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
import { EntryCardInputDirective } from '../../entry-card-content/entry-card-input.directive';
import { Processing } from '@fairandsmart/consents-ce/models';
import { TranslateService } from '@ngx-translate/core';
import { KeycloakService } from 'keycloak-angular';
import { AlertService } from '../../../../../../core/services/alert.service';
import { ConfigService } from '../../../../../../core/services/config.service';

@Component({
  selector: 'cm-processing-input',
  templateUrl: './processing-input.component.html',
  styleUrls: ['../../entry-card/entry-card.component.scss', '../processing.component.scss']
})
export class ProcessingInputComponent extends EntryCardInputDirective<Processing> implements OnInit {

  constructor(
    protected translate: TranslateService,
    protected keycloakService: KeycloakService,
    protected alertService: AlertService,
    protected configService: ConfigService
  ) {
    super(translate, keycloakService, alertService, configService);
  }

  ngOnInit(): void {
    super.ngOnInit();
    if (!this.refusable) {
      this.disabled = this.control.value;
      this.control.valueChanges.subscribe((value) => {
        if (value && !this.disabled) {
          this.disableControl();
          this.disabled = true;
        }
      });
    }
  }

  parseValue(): boolean {
    return this.recordValue === 'accepted';
  }

  serializeValue(): string {
    return this.control.value ? 'accepted' : 'refused';
  }

}
