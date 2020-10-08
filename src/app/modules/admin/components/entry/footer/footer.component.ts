import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Footer, ModelDataType } from '../../../../../core/models/models';
import { ModelsResourceService } from '../../../../../core/http/models-resource.service';
import { EntryContentDirective } from '../entry-content/entry-content.directive';
import { TranslateService } from '@ngx-translate/core';
import { DomSanitizer } from '@angular/platform-browser';
import { AlertService } from '../../../../../core/services/alert.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['../entry-content/_entry-content.directive.scss', './footer.component.scss']
})
export class FooterComponent extends EntryContentDirective<Footer> implements OnInit {

  constructor(
      private fb: FormBuilder,
      modelsResourceService: ModelsResourceService,
      alertService: AlertService,
      translateService: TranslateService,
      sanitizer: DomSanitizer) {
    super(modelsResourceService, alertService, sanitizer);
  }

  get type(): ModelDataType {
    return 'footer';
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  protected initForm(): void {
    this.form = this.fb.group({
      type: [this.type, [Validators.required]],
      body: ['', [Validators.required]],
      showAcceptAll: [false],
      customAcceptAllText: ['']
    });
    this.initPreview();
  }

}
