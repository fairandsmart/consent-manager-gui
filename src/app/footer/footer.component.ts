import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Footer } from '../models';
import { ModelsResourceService } from '../models-resource.service';
import { EntryContentDirective } from '../entry-content/entry-content.directive';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LANGUAGES } from '../common/constants';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['../entry-content/_entry-content.directive.scss', './footer.component.scss']
})
export class FooterComponent extends EntryContentDirective<Footer> implements OnInit {

  readonly LANGUAGES = LANGUAGES;

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
      type: ['footer', [Validators.required]],
      locale: ['', [Validators.required]],
      body: ['', [Validators.required]],
      showAcceptAll: [false],
      customAcceptAllText: ['']
    });
  }

  protected refreshPreview(): void {
    throw new Error('Method not implemented.'); // TODO
  }

}
