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
import { Conditions } from '@fairandsmart/consents-ce/models';
import { TranslateService } from '@ngx-translate/core';
import { KeycloakService } from 'keycloak-angular';
import { AlertService } from '../../../../../../core/services/alert.service';
import { ConfigService } from '../../../../../../core/services/config.service';

@Component({
  selector: 'cm-conditions-input',
  templateUrl: './conditions-input.component.html',
  styleUrls: ['../../entry-card/entry-card.component.scss', '../conditions.component.scss']
})
export class ConditionsInputComponent extends EntryCardInputDirective<Conditions> implements OnInit {

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

  enableControl(): void {
    if (this.recordValue === 'accepted') {
      return;
    }
    this.control.enable({emitEvent: false});
  }

  parseValue(): any {
    return this.recordValue === 'accepted';
  }

  serializeValue(): string {
    return this.control.value ? 'accepted' : 'refused';
  }

}
