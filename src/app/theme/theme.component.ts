import { Component, OnInit } from '@angular/core';
import { EntryContentDirective } from '../entry-content/entry-content.directive';
import { Theme, TARGET_TYPES } from '../models';
import { FormBuilder, Validators } from '@angular/forms';
import { ModelsResourceService } from '../models-resource.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LANGUAGES } from '../common/constants';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-theme',
  templateUrl: './theme.component.html',
  styleUrls: ['../entry-content/_entry-content.directive.scss', './theme.component.scss']
})
export class ThemeComponent extends EntryContentDirective<Theme> implements OnInit {

  readonly LANGUAGES = LANGUAGES;
  readonly TARGET_TYPES = TARGET_TYPES;

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
      type: ['theme', [Validators.required]],
      locale: ['', [Validators.required]],
      name: ['', [Validators.required]],
      presentation: [''],
      targetType: ['', [Validators.required]],
      icon: [''],
      css: ['', [Validators.required]]
    });
  }

}
