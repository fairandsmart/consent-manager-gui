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
import { LOGO_POSITIONS, LogoPosition, PreviewDto, Theme } from '@fairandsmart/consent-manager/models';
import { FormBuilder, Validators } from '@angular/forms';
import { AlertService } from '../../../../../core/services/alert.service';
import { TranslateService } from '@ngx-translate/core';
import { ConfigService } from '../../../../../core/services/config.service';
import { MatDialog } from '@angular/material/dialog';
import { AceConfigInterface } from "ngx-ace-wrapper";

@Component({
  selector: 'cm-theme',
  templateUrl: './theme.component.html',
  styleUrls: ['../entry-content/_entry-content.directive.scss', './theme.component.scss']
})
export class ThemeComponent extends EntryContentDirective<Theme> implements OnInit {

  readonly LOGO_POSITIONS = LOGO_POSITIONS;

  readonly ACE_OPTIONS: AceConfigInterface = {
    enableBasicAutocompletion: true,
  };

  constructor(
    private fb: FormBuilder,
    alertService: AlertService,
    protected translate: TranslateService,
    configService: ConfigService,
    dialog: MatDialog) {
    super(alertService, configService, dialog, translate);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  protected initForm(): void {
    this.form = this.fb.group({
      type: [this.type, [Validators.required]],
      logoPath: [''],
      logoAltText: [''],
      logoPosition: [LogoPosition.CENTER],
      css: ['']
    });
    this.checkFormState();
  }

  protected makePreviewDto(language, values): PreviewDto {
    if (this.container?.preview?.orientationCtrl) {
      return {
        language: language,
        orientation: this.container.preview.orientationCtrl.value,
        data: values,
        previewType: this.container.preview.previewTypeCtrl.value
      };
    } else {
      return super.makePreviewDto(language, values);
    }
  }
}
