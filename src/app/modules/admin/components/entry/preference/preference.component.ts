import { Component, OnInit } from '@angular/core';
import { EntryContentDirective } from '../entry-content/entry-content.directive';
import {
  ModelDataType,
  ModelVersionDto,
  Preference,
  PREFERENCE_VALUE_TYPES
} from '../../../../../core/models/models';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ModelsResourceService } from '../../../../../core/http/models-resource.service';
import { DomSanitizer } from '@angular/platform-browser';
import { AlertService } from '../../../../../core/services/alert.service';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

@Component({
  selector: 'cm-preference',
  templateUrl: './preference.component.html',
  styleUrls: ['../entry-content/_entry-content.directive.scss', './preference.component.scss']
})
export class PreferenceComponent extends EntryContentDirective<Preference> implements OnInit {

  static CONTEXT = 'preference';
  public readonly VALUE_TYPES = PREFERENCE_VALUE_TYPES;

  separatorKeysCodes: number[] = [ENTER, COMMA];
  optionsInputCtrl: FormControl;

  constructor(
    private fb: FormBuilder,
    modelsResourceService: ModelsResourceService,
    alertService: AlertService,
    sanitizer: DomSanitizer) {
    super(PreferenceComponent.CONTEXT, modelsResourceService, alertService, sanitizer);
  }

  get type(): ModelDataType {
    return 'preference';
  }

  ngOnInit(): void {
    this.optionsInputCtrl = new FormControl('', Validators.required);
    super.ngOnInit();
  }

  protected initForm(): void {
    this.form = this.fb.group({
      type: [this.type, [Validators.required]],
      label: ['', [Validators.required]],
      description: [''],
      valueType: ['NONE', [Validators.required]],
      options: [[]]
    });
    this.checkFormState();
  }

  registerFormChanges(): void {
    this.form.get('valueType').valueChanges.subscribe(v => {
      if (v === 'NONE' || v === 'FREE_TEXT') {
        this.form.get('options').setValue([]);
        this.form.get('options').clearValidators();
      } else {
        const validators = [Validators.required, Validators.minLength(v === 'CHECKBOXES' ? 1 : 2)];
        if (v === 'TOGGLE') {
          validators.push(Validators.maxLength(2));
        }
        this.form.get('options').setValidators(validators);
      }
      this.form.get('options').updateValueAndValidity();
    });
    super.registerFormChanges();
  }

  addOption($event: MatChipInputEvent): void {
    const input = $event.input;
    const value = ($event.value || '').trim().toLowerCase();
    if (value) {
      const values: string[] = this.form.get('options').value || [];
      if (value.length > 0 && values.indexOf(value) === -1) {
        values.push(value);
        this.form.get('options').setValue(values);
      }
    }
    // Reset the input value
    if (input) {
      input.value = '';
    }
    this.optionsInputCtrl.setValue('');
  }

  removeOption(value: string): void {
    const values: string[] = this.form.get('options').value || [];
    this.form.get('options').setValue(values.filter(t => t !== value));
  }

  protected setVersion(version: ModelVersionDto<Preference>, language: string = this.version.defaultLanguage): void {
    super.setVersion(version, language);
  }
}
