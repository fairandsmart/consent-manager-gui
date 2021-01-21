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
import { EntryContentDirective } from '../entry-content/entry-content.directive';
import { Email, ModelDataType } from '../../../../../core/models/models';
import { FormBuilder, Validators } from '@angular/forms';
import { ModelsResourceService } from '../../../../../core/http/models-resource.service';
import { DomSanitizer } from '@angular/platform-browser';
import { AlertService } from '../../../../../core/services/alert.service';
import {ConfigService} from '../../../../../core/services/config.service';

@Component({
  selector: 'cm-email',
  templateUrl: './email.component.html',
  styleUrls: ['../entry-content/_entry-content.directive.scss', './email.component.scss']
})
export class EmailComponent extends EntryContentDirective<Email> implements OnInit {

  static CONTEXT = 'email';

  constructor(
    private fb: FormBuilder,
    modelsResourceService: ModelsResourceService,
    alertService: AlertService,
    sanitizer: DomSanitizer,
    configService: ConfigService) {
    super(EmailComponent.CONTEXT, modelsResourceService, alertService, sanitizer, configService);
  }

  get type(): ModelDataType {
    return 'email';
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
