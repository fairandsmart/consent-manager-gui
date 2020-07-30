import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { EntryContentDirective } from '../entry-content/entry-content.directive';
import { CollectionMethod, Conditions, ConsentContext, ConsentFormOrientation, ConsentFormType } from '../models';
import { FormBuilder, Validators } from '@angular/forms';
import { ModelsResourceService } from '../models-resource.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LANGUAGES } from '../common/constants';
import { TranslateService } from '@ngx-translate/core';
import { debounceTime } from 'rxjs/operators';
import { FormUrlDialogComponent, FormUrlDialogComponentData } from '../form-url-dialog/form-url-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ConsentsResourceService } from '../consents-resource.service';
import { SafeHtml } from '@angular/platform-browser';

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
  public safePreview: SafeHtml;

  @ViewChild('preview')
  private iframe: ElementRef;

  constructor(
      private fb: FormBuilder,
      modelsResourceService: ModelsResourceService,
      public consentsResourceService: ConsentsResourceService,
      snackBar: MatSnackBar,
      translateService: TranslateService,
      private dialog: MatDialog) {
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
    if (this.form.get('body').value) {
      const stopLinks = '<style>a { pointer-events: none; }</style>';
      this.safePreview = stopLinks + this.form.get('body').value;
    } else {
      this.safePreview = null;
    }
  }

  openApiUrlDialog(): void {
    if (this.form.invalid) {
      return;
    }
    const formValue = this.form.getRawValue();
    const context: ConsentContext = {
      owner: '', // géré côté backend
      subject: '',
      orientation: ConsentFormOrientation.VERTICAL,
      header: '',
      elements: [this.entry.key],
      footer: '',
      callback: '',
      validity: '',
      locale: formValue.locale,
      formType: ConsentFormType.FULL,
      receiptDeliveryType: 'NONE',
      userinfos: {},
      attributes: {},
      optoutEmail: '',
      collectionMethod: CollectionMethod.WEBFORM,
      author: '',
      preview: false,
      iframe: true,
      conditions: true,
      theme: ''
    };
    this.consentsResourceService.generateToken(context).subscribe((token) => {
      const url = this.consentsResourceService.buildSubmitConsentUrl(token);
      this.dialog.open<FormUrlDialogComponent, FormUrlDialogComponentData>(FormUrlDialogComponent, {
        data: {url: url}
      });
    }, (err) => {
      console.error(err);
    });
  }
}
