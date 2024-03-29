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
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { EntryContentDirective } from '../entry-content/entry-content.directive';
import { Email } from '@fairandsmart/consents-ce/models';
import { FormBuilder, Validators } from '@angular/forms';
import { AlertService } from '../../../../../core/services/alert.service';
import { ConfigService } from '../../../../../core/services/config.service';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'cm-email',
  templateUrl: './email.component.html',
  styleUrls: ['../entry-content/_entry-content.directive.scss', './email.component.scss']
})
export class EmailComponent extends EntryContentDirective<Email> implements OnInit {

  constructor(
    private fb: FormBuilder,
    alertService: AlertService,
    configService: ConfigService,
    keycloak: KeycloakService,
    dialog: MatDialog,
    translate: TranslateService,
    cd: ChangeDetectorRef) {
    super(alertService, configService, keycloak, dialog, translate, cd);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  protected initForm(): void {
    this.form = this.fb.group({
      type: [this.type, [Validators.required]],
      sender: ['', [Validators.required, Validators.email]],
      subject: ['', [Validators.required]],
      title: ['', [Validators.required]],
      body: ['', [Validators.required]],
      buttonLabel: ['', [Validators.required]],
      footer: ['', [Validators.required]],
      signature: ['', [Validators.required]]
    });
    this.checkFormState();
  }

}
