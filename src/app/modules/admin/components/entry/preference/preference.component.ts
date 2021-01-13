import { Component, OnInit } from '@angular/core';
import { EntryContentDirective } from '../entry-content/entry-content.directive';
import { ModelDataType, Preference, PREFERENCE_VALUE_TYPES, PreferenceValueType } from '../../../../../core/models/models';
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
      valueType: [PreferenceValueType.CHECKBOXES, [Validators.required]],
      optional: [false, [Validators.required]],
      options: [[]],
      includeDefault: [true, [Validators.required]],
      defaultValues: [[]]
    });
    this.checkFormState();
  }

  registerFormChanges(): void {
    this.form.get('valueType').valueChanges.subscribe(v => {
      if (v === PreferenceValueType.FREE_TEXT) {
        this.form.get('options').setValue([]);
        this.form.get('options').clearValidators();
        this.form.get('includeDefault').setValue(false);
      } else {
        const validators = [Validators.required, Validators.minLength(v === PreferenceValueType.CHECKBOXES ? 1 : 2)];
        if (v === PreferenceValueType.TOGGLE) {
          validators.push(Validators.maxLength(2));
        }
        this.form.get('options').setValidators(validators);
        this.updateDefaultValuesValidators(v);
      }
      this.form.get('options').updateValueAndValidity();
    });

    this.form.get('options').valueChanges.subscribe(v => {
      const defaultValues = this.form.get('defaultValues').value.filter(d => v.includes(d));
      this.form.get('defaultValues').setValue(defaultValues);
      this.form.get('defaultValues').updateValueAndValidity();
    });

    this.form.get('includeDefault').valueChanges.subscribe(v => {
      if (v) {
        this.updateDefaultValuesValidators(this.form.get('valueType').value);
      } else {
        this.form.get('defaultValues').setValue([]);
        this.form.get('defaultValues').clearValidators();
        this.form.get('defaultValues').updateValueAndValidity();
      }
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

  protected updateDefaultValuesValidators(valueType): void {
    const validators = [Validators.required];
    if (valueType !== PreferenceValueType.LIST_MULTI && valueType !== PreferenceValueType.CHECKBOXES) {
      validators.push(Validators.maxLength(1));
    } else {
    }
    this.form.get('defaultValues').setValidators(validators);
    this.form.get('defaultValues').updateValueAndValidity();
  }
}
