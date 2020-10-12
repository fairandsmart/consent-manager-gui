import { Component, OnInit } from '@angular/core';
import { EntryContentDirective } from '../entry-content/entry-content.directive';
import { CollectionMethod, Conditions, ConsentContext, ConsentFormOrientation, ConsentFormType, ModelDataType } from '../../../../../core/models/models';
import { FormBuilder, Validators } from '@angular/forms';
import { ModelsResourceService } from '../../../../../core/http/models-resource.service';
import { FormUrlDialogComponent, FormUrlDialogComponentData } from '../../form-url-dialog/form-url-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ConsentsResourceService } from '../../../../../core/http/consents-resource.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AlertService } from '../../../../../core/services/alert.service';

@Component({
  selector: 'app-conditions',
  templateUrl: './conditions.component.html',
  styleUrls: ['../entry-content/_entry-content.directive.scss', './conditions.component.scss']
})
export class ConditionsComponent extends EntryContentDirective<Conditions> implements OnInit {

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

  constructor(
      private fb: FormBuilder,
      modelsResourceService: ModelsResourceService,
      public consentsResourceService: ConsentsResourceService,
      alertService: AlertService,
      sanitizer: DomSanitizer,
      private dialog: MatDialog) {
    super(modelsResourceService, alertService, sanitizer);
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
      info: '',
      elements: [this.entry.key],
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
      const url = this.consentsResourceService.getFormUrl(token);
      this.dialog.open<FormUrlDialogComponent, FormUrlDialogComponentData>(FormUrlDialogComponent, {
        data: {url: url}
      });
    }, (err) => {
      console.error(err);
    });
  }

}
