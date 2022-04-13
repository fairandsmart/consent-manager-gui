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
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { EntryContentDirective } from '../entry-content/entry-content.directive';
import { LOGO_POSITIONS, LogoPosition, PreviewDto, Theme } from '@fairandsmart/consents-ce/models';
import { FormBuilder, Validators } from '@angular/forms';
import { AlertService } from '../../../../../core/services/alert.service';
import { TranslateService } from '@ngx-translate/core';
import { ConfigService } from '../../../../../core/services/config.service';
import { MatDialog } from '@angular/material/dialog';
import { AceConfigInterface } from 'ngx-ace-wrapper';
import { CSS_HINTS } from '@fairandsmart/consents-ce/css-autocomplete';
// @ts-ignore
import ace from 'brace';
import { KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'cm-theme',
  templateUrl: './theme.component.html',
  styleUrls: ['../entry-content/_entry-content.directive.scss', './theme.component.scss']
})
export class ThemeComponent extends EntryContentDirective<Theme> implements OnInit, AfterViewInit {

  readonly LOGO_POSITIONS = LOGO_POSITIONS;

  readonly ACE_OPTIONS: AceConfigInterface = {
    enableBasicAutocompletion: true,
  };

  constructor(
    private fb: FormBuilder,
    alertService: AlertService,
    protected translate: TranslateService,
    configService: ConfigService,
    keycloak: KeycloakService,
    dialog: MatDialog) {
    super(alertService, configService, keycloak, dialog, translate);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  ngAfterViewInit(): void {
    const langTools = ace.acequire('ace/ext/language_tools');
    const translate = this.translate;
    const completer = {
      // tslint:disable-next-line:only-arrow-functions typedef
      getCompletions: function(editor, session, pos, prefix, callback) {
        const suggestions = CSS_HINTS
          .filter(el => el.value.startsWith(prefix) ||
            el.context[translate.currentLang].toLocaleLowerCase().startsWith(prefix) ||
            el.position[translate.currentLang].toLocaleLowerCase().startsWith(prefix) ||
            (el.description !== undefined && el.description[translate.currentLang].toLocaleLowerCase().startsWith(prefix)))
          .map(el => {
            return {
              value: el.value,
              meta: el.context[translate.currentLang],
              type: 'cm-class',
              context: el.context[translate.currentLang],
              position: el.position[translate.currentLang],
              description: el.description ? el.description[translate.currentLang] : ''
            };
          })
          .sort((a, b) => {
            return a.context.localeCompare(b.context) || a.position.localeCompare(b.position) ||
              a.description.localeCompare(b.description) || a.value.localeCompare(b.value);
          });
        callback(null, suggestions);
      },
      getDocTooltip: (item) => {
        if (item.type === 'cm-class' && !item.docHTML) {
          if (item.description !== undefined && item.description !== '') {
            item.docHTML = `<b>${item.context}</b><hr><b>${item.position}:</b> ${item.description}`;
          } else {
            item.docHTML = `<b>${item.context}</b><hr><b>${item.position}</b>`;
          }
        }
      }
    };
    langTools.addCompleter(completer);
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
