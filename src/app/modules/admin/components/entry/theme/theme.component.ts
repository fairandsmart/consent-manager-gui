import { Component, OnInit } from '@angular/core';
import { EntryContentDirective } from '../entry-content/entry-content.directive';
import {
  ConsentFormOrientation,
  LOGO_POSITIONS,
  LogoPosition,
  ModelDataType,
  PreviewDto,
  PreviewType,
  Theme
} from '../../../../../core/models/models';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ModelsResourceService } from '../../../../../core/http/models-resource.service';
import * as CodeMirror from 'codemirror';
import { Editor } from 'codemirror';
import { DomSanitizer } from '@angular/platform-browser';
import { AlertService } from '../../../../../core/services/alert.service';
import { TranslateService } from '@ngx-translate/core';
import { ThemeAutocomplete } from './_theme-autocomplete';

@Component({
  selector: 'cm-theme',
  templateUrl: './theme.component.html',
  styleUrls: ['../entry-content/_entry-content.directive.scss', './theme.component.scss']
})
export class ThemeComponent extends EntryContentDirective<Theme> implements OnInit {

  static CONTEXT = 'theme';
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
        if (inner.mode.name !== 'css') { return; }

        if (token.type === 'keyword' && '!important'.indexOf(token.string) === 0) {
          return {
            list: ['!important'],
            from: CodeMirror.Pos(cur.line, token.start),
            to: CodeMirror.Pos(cur.line, token.end)
          };
        }

        let start = token.start;
        let end = cur.ch;
        let word = token.string.slice(0, end - start);
        if (/[^\w$_-]/.test(word)) {
          word = '';
          start = end = cur.ch;
        }

        const spec = (window.CodeMirror as any).resolveMode('text/css');

        let result = [];

        const st = inner.state.state;
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
          if (word?.length > 0) {
            result = result.filter(i => {
              if (typeof i === 'string') {
                return i.startsWith(word);
              } else {
                return i.text?.startsWith(word);
              }
            });
          }
        }

        if (result.length) {
          return {
            list: result,
            from: CodeMirror.Pos(cur.line, start),
            to: CodeMirror.Pos(cur.line, end)
          };
        }
      }
    }
  };

  previewTypeCtrl: FormControl;
  orientationCtrl: FormControl;

  constructor(
    private fb: FormBuilder,
    modelsResourceService: ModelsResourceService,
    alertService: AlertService,
    sanitizer: DomSanitizer,
    public translate: TranslateService) {
    super(ThemeComponent.CONTEXT, modelsResourceService, alertService, sanitizer);
  }

  get type(): ModelDataType {
    return 'theme';
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.previewTypeCtrl = new FormControl(PreviewType.FORM, [Validators.required]);
    this.orientationCtrl = new FormControl(ConsentFormOrientation.VERTICAL, [Validators.required]);
    this.previewTypeCtrl.valueChanges.subscribe(value => {
      if (value !== PreviewType.FORM) {
        this.orientationCtrl.disable();
        this.orientationCtrl.setValue(ConsentFormOrientation.VERTICAL);
      } else {
        this.orientationCtrl.enable();
      }
      this.refreshPreview();
    });
    this.orientationCtrl.valueChanges.subscribe(value => {
      if (this.orientationCtrl.enabled) {
        this.refreshPreview();
      }
    });
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
      orientation: this.orientationCtrl.value,
      data: values,
      previewType: this.previewTypeCtrl.value
    };
  }
}
