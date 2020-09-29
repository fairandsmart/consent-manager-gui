import { Component, OnInit } from '@angular/core';
import { EntryContentDirective } from '../entry-content/entry-content.directive';
import { ModelDataType, Preference } from '../models';
import { FormBuilder, Validators } from '@angular/forms';
import { ModelsResourceService } from '../services/models-resource.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-preference',
  templateUrl: './preference.component.html',
  styleUrls: ['../entry-content/_entry-content.directive.scss', './preference.component.scss']
})
export class PreferenceComponent extends EntryContentDirective<Preference> implements OnInit {

  constructor(
    private fb: FormBuilder,
    modelsResourceService: ModelsResourceService,
    snackBar: MatSnackBar,
    translateService: TranslateService,
    sanitizer: DomSanitizer) {
    super(modelsResourceService, snackBar, translateService, sanitizer);
  }

  get type(): ModelDataType {
    return 'preference';
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  protected initForm(): void {
    this.form = this.fb.group({
      type: [this.type, [Validators.required]],
      title: ['', [Validators.required]],
      body: ['', [Validators.required]]
    });
    this.initPreview();
  }

}
