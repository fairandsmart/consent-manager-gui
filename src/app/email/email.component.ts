import { Component, OnInit } from '@angular/core';
import { EntryContentDirective } from '../entry-content/entry-content.directive';
import { Email, ModelDataType } from '../models';
import { FormBuilder, Validators } from '@angular/forms';
import { ModelsResourceService } from '../services/models-resource.service';
import { DomSanitizer } from '@angular/platform-browser';
import { AlertService } from '../services/alert.service';

@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['../entry-content/_entry-content.directive.scss', './email.component.scss']
})
export class EmailComponent extends EntryContentDirective<Email> implements OnInit {

  constructor(
    private fb: FormBuilder,
    modelsResourceService: ModelsResourceService,
    alertService: AlertService,
    sanitizer: DomSanitizer) {
    super(modelsResourceService, alertService, sanitizer);
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
      sender: ['', [Validators.required]],
      subject: ['', [Validators.required]],
      title: ['', [Validators.required]],
      body: ['', [Validators.required]],
      buttonLabel: ['', [Validators.required]],
      footer: ['', [Validators.required]],
      signature: ['', [Validators.required]]
    });
    this.initPreview();
  }

}
