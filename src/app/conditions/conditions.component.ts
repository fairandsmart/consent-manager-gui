import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { EntryContentDirective } from '../entry-content/entry-content.directive';
import {
  CollectionMethod,
  Conditions,
  ConsentContext,
  ConsentFormOrientation,
  ConsentFormType,
  ModelDataType
} from '../models';
import { FormBuilder, Validators } from '@angular/forms';
import { ModelsResourceService } from '../models-resource.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LANGUAGES } from '../common/constants';
import { TranslateService } from '@ngx-translate/core';
import { FormUrlDialogComponent, FormUrlDialogComponentData } from '../form-url-dialog/form-url-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ConsentsResourceService } from '../consents-resource.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-conditions',
  templateUrl: './conditions.component.html',
  styleUrls: ['../entry-content/_entry-content.directive.scss', './conditions.component.scss']
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

  public safePreview: SafeHtml;

  @ViewChild('preview')
  private iframe: ElementRef;

  constructor(
      private fb: FormBuilder,
      modelsResourceService: ModelsResourceService,
      public consentsResourceService: ConsentsResourceService,
      snackBar: MatSnackBar,
      translateService: TranslateService,
      sanitizer: DomSanitizer,
      private dialog: MatDialog) {
    super(modelsResourceService, snackBar, translateService, sanitizer);
  }

  get type(): ModelDataType {
    return 'conditions';
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  protected initForm(): void {
    this.form = this.fb.group({
      type: [this.type, [Validators.required]],
      locale: ['', [Validators.required]],
      title: ['', [Validators.required]],
      body: ['', [Validators.required]],
      acceptLabel: ['', [Validators.required]],
      rejectLabel: ['', [Validators.required]]
    });
    this.initPreview();
  }

  openApiUrlDialog(): void {
    if (this.form.invalid) {
      return;
    }
    const formValue = this.form.getRawValue();
    const context: ConsentContext = {
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
      optoutModel: '',
      optoutRecipient: '',
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
