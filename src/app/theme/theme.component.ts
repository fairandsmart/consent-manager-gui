import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { EntryContentDirective } from '../entry-content/entry-content.directive';
import { TARGET_TYPES, Theme } from '../models';
import { FormBuilder, Validators } from '@angular/forms';
import { ModelsResourceService } from '../models-resource.service';
import { ConsentsResourceService } from '../consents-resource.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LANGUAGES } from '../common/constants';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../environments/environment';
import * as CodeMirror from 'codemirror';
import { Editor } from 'codemirror';
import { debounceTime, skip, tap } from 'rxjs/operators';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

const snippets: { text: string, displayText: string }[] = [
  { text: '.logo-wrapper', displayText: 'Logo - Conteneur' },
  { text: '.logo-wrapper .logo', displayText: 'Logo - Image' },
  { text: '.header', displayText: 'En-tête - Conteneur' },
  { text: '.header h2', displayText: 'En-tête - Titre' },
  { text: '.header .header-body', displayText: 'En-tête - Corps' },
  { text: '.header .privacy-policy-link-wrapper a', displayText: 'En-tête - Lien vers la politique de confidentialité' },
  { text: '.treatments', displayText: 'Traitements - Conteneur' },
];

@Component({
  selector: 'app-theme',
  templateUrl: './theme.component.html',
  styleUrls: ['../entry-content/_entry-content.directive.scss', './theme.component.scss']
})
export class ThemeComponent extends EntryContentDirective<Theme> implements OnInit, AfterViewInit {

  readonly LANGUAGES = LANGUAGES;
  readonly TARGET_TYPES = TARGET_TYPES;
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
          word = ''; start = end = cur.ch;
        }

        const spec = (window.CodeMirror as any).resolveMode('text/css');

        let result = [];

        const st = inner.state.state;
        if (st === 'top') {
          result.push(...snippets);
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

  private rawPreview: string;
  public safePreview: SafeHtml;
  private delay = 500;

  constructor(
      private fb: FormBuilder,
      modelsResourceService: ModelsResourceService,
      private consentsResourceService: ConsentsResourceService,
      private sanitizer: DomSanitizer,
      snackBar: MatSnackBar,
      translateService: TranslateService) {
    super(modelsResourceService, snackBar, translateService);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  ngAfterViewInit(): void {
    this.consentsResourceService.getPreviewForm().subscribe((content) => {
      this.rawPreview = content.split('/assets/').join(`${environment.managerUrl}/assets/`);
      this.refreshPreview();
    });
  }

  protected initForm(): void {
    this.form = this.fb.group({
      type: ['theme', [Validators.required]],
      locale: ['', [Validators.required]],
      // name: ['', [Validators.required]],
      // presentation: [''],
      targetType: ['', [Validators.required]],
      // icon: [''],
      css: ['', [Validators.required]]
    });
    this.form.get('css').valueChanges.pipe(
      skip(1),
      debounceTime(this.delay),
      tap(() => this.refreshPreview())
    ).subscribe();
  }

  refreshPreview(): void {
    if (this.rawPreview != null) {
      let result = this.rawPreview;
      const style = this.form.get('css');
      if (style && style.value) {
        result = result.replace('</head>', `<style>${style.value}</style></head>`);
      }
      this.safePreview = this.sanitizer.bypassSecurityTrustHtml(result);
    }
  }
}
