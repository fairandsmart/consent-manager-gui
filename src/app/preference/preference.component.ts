import { Component, OnInit } from '@angular/core';
import { EntryContentDirective } from '../entry-content/entry-content.directive';
import { ModelDataType, Preference } from '../models';
import { FormBuilder, Validators } from '@angular/forms';
import { ModelsResourceService } from '../services/models-resource.service';
import { DomSanitizer } from '@angular/platform-browser';
import { AlertService } from '../services/alert.service';

@Component({
  selector: 'app-preference',
  templateUrl: './preference.component.html',
  styleUrls: ['../entry-content/_entry-content.directive.scss', './preference.component.scss']
})
export class PreferenceComponent extends EntryContentDirective<Preference> implements OnInit {

  constructor(
    private fb: FormBuilder,
    modelsResourceService: ModelsResourceService,
    alertService: AlertService,
    sanitizer: DomSanitizer) {
    super(modelsResourceService, alertService, sanitizer);
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
