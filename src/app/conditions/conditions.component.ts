import { Component, OnInit } from '@angular/core';
import { EntryContentDirective } from '../entry-content/entry-content.directive';
import { Conditions } from '../models';
import { FormBuilder, Validators } from '@angular/forms';
import { ModelsResourceService } from '../models-resource.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LANGUAGES } from '../common/constants';

@Component({
  selector: 'app-conditions',
  templateUrl: './conditions.component.html',
  styleUrls: ['../entry-content/_entry-content.directive.scss', './conditions.component.scss']
})
export class ConditionsComponent extends EntryContentDirective<Conditions> implements OnInit {

  readonly LANGUAGES = LANGUAGES;

  constructor(private fb: FormBuilder, modelsResourceService: ModelsResourceService, snackBar: MatSnackBar) {
    super(modelsResourceService, snackBar);
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
  }

}