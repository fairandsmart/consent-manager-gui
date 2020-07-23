import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { EntryContentDirective } from '../entry-content/entry-content.directive';
import { Conditions } from '../models';
import { FormBuilder, Validators } from '@angular/forms';
import { ModelsResourceService } from '../models-resource.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LANGUAGES } from '../common/constants';
import { TranslateService } from '@ngx-translate/core';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-conditions',
  templateUrl: './conditions.component.html',
  styleUrls: ['../entry-content/_entry-content.directive.scss', '../theme/theme.component.scss', './conditions.component.scss']
})
export class ConditionsComponent extends EntryContentDirective<Conditions> implements OnInit {

  readonly LANGUAGES = LANGUAGES;
  readonly CODE_MIRROR_OPTIONS = {
    lineNumbers: true,
    mode: 'htmlmixed',
    gutters: ['CodeMirror-lint-markers'],
    lint: true,
    extraKeys: {
      'Ctrl-Space': 'autocomplete',
      'Ctrl-E': 'autocomplete',
      'Cmd-E': 'autocomplete'
    }
  };

  private delay = 500;

  @ViewChild('preview')
  private iframe: ElementRef;

  constructor(
      private fb: FormBuilder,
      modelsResourceService: ModelsResourceService,
      snackBar: MatSnackBar,
      translateService: TranslateService) {
    super(modelsResourceService, snackBar, translateService);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  protected initForm(): void {
    this.form = this.fb.group({
      type: ['conditions', [Validators.required]],
      locale: ['', [Validators.required]],
      title: ['', [Validators.required]],
      body: ['', [Validators.required]],
      acceptLabel: ['', [Validators.required]],
      rejectLabel: ['', [Validators.required]]
    });
    this.form.valueChanges.pipe(debounceTime(this.delay)).subscribe(() => {
      this.refreshPreview();
    });
  }

  refreshPreview(): void {
    if (this.iframe.nativeElement?.contentDocument?.body) {
      this.iframe.nativeElement.contentDocument.body.innerHTML = this.form.get('body').value;
    }
  }
}
