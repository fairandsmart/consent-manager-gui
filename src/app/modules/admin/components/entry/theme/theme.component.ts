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
import * as CodeMirror from 'codemirror';
import { Editor } from 'codemirror';
import { AlertService } from '../../../../../core/services/alert.service';
import { TranslateService } from '@ngx-translate/core';
import { ThemeAutocomplete } from './_theme-autocomplete';
import { ConfigService } from '../../../../../core/services/config.service';
import { BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'cm-theme',
  templateUrl: './theme.component.html',
  styleUrls: ['../entry-content/_entry-content.directive.scss', './theme.component.scss']
})
export class ThemeComponent extends EntryContentDirective<Theme> implements OnInit {

  readonly LOGO_POSITIONS = LOGO_POSITIONS;

  readonly CODE_MIRROR_OPTIONS = {
    lineNumbers: true,
    mode: 'css',
    gutters: ['CodeMirror-lint-markers'],
    lint: true,
    extraKeys: {
      'Ctrl-Space': 'autocomplete',
      'Ctrl-E': 'autocomplete',
      'Cmd-E': 'autocomplete'
    },
    hintOptions: {
      hint: (cm: Editor) => {
        const cur = cm.getCursor();
        const token = cm.getTokenAt(cur);
        const inner = CodeMirror.innerMode(cm.getMode(), token.state);
        if (inner.mode.name !== 'css') {
          return;
        }

        if (token.type === 'keyword' && '!important'.indexOf(token.string) === 0) {
          return {
            list: ['!important'],
            from: CodeMirror.Pos(cur.line, token.start),
            to: CodeMirror.Pos(cur.line, token.end)
          };
        }

        const spec = (window.CodeMirror as any).resolveMode('text/css');
        const st = inner.state.state;
        let result = [];
        if (st === 'top') {
          result.push(...ThemeAutocomplete.createSnippets(this.translate.currentLang));
        } else {
          if (st === 'pseudo' || token.type === 'variable-3') {
          } else if (st === 'block' || st === 'maybeprop') {
            result.push(...Object.keys(spec.propertyKeywords));
          } else if (st === 'prop' || st === 'parens' || st === 'at' || st === 'params') {
            result.push(...Object.keys(spec.valueKeywords));
            result.push(...Object.keys(spec.colorKeywords));
          } else if (st === 'media' || st === 'media_parens') {
            result.push(...Object.keys(spec.mediaTypes));
            result.push(...Object.keys(spec.mediaFeatures));
          }
        }

        const start = token.start;
        const end = cur.ch;
        const word = token.string.slice(0, end - start).toLowerCase();
        if (word?.length > 0) {
          result = result.filter(i => {
            if (typeof i === 'string') {
              return i.startsWith(word);
            } else {
              return i.text?.startsWith(word) || i.displayText?.toLowerCase().includes(word);
            }
          });
        }

        if (result.length) {
          result.sort((a, b) => {
            const aText = (a.displayText ? a.displayText : a).toLowerCase();
            const bText = (b.displayText ? b.displayText : b).toLowerCase();
            return aText.localeCompare(bText);
          });

          return {
            list: result,
            from: CodeMirror.Pos(cur.line, start),
            to: CodeMirror.Pos(cur.line, end)
          };
        }
      }
    }
  };

  constructor(
    private fb: FormBuilder,
    alertService: AlertService,
    public translate: TranslateService,
    configService: ConfigService,
    breakpointObserver: BreakpointObserver) {
    super(alertService, configService, breakpointObserver);
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
    return {
      language: language,
      orientation: this.preview.orientationCtrl.value,
      data: values,
      previewType: this.preview.previewTypeCtrl.value
    };
  }
}
