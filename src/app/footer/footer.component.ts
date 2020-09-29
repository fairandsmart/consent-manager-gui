import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Footer, ModelDataType } from '../models';
import { ModelsResourceService } from '../services/models-resource.service';
import { EntryContentDirective } from '../entry-content/entry-content.directive';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['../entry-content/_entry-content.directive.scss', './footer.component.scss']
})
export class FooterComponent extends EntryContentDirective<Footer> implements OnInit {

  constructor(
      private fb: FormBuilder,
      modelsResourceService: ModelsResourceService,
      snackBar: MatSnackBar,
      translateService: TranslateService,
      sanitizer: DomSanitizer) {
    super(modelsResourceService, snackBar, translateService, sanitizer);
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
