import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { EntryContentDirective } from '../entry-content/entry-content.directive';
import { ModelDataType, Preference } from '../../../../../core/models/models';
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

  separatorKeysCodes: number[] = [ENTER, COMMA];
  inputCtrl: {[key: string]: FormControl};
  @ViewChild('contentTypeInput') contentTypeInput: ElementRef<HTMLInputElement>;
  @ViewChild('contentThemeInput') contentThemeInput: ElementRef<HTMLInputElement>;
  @ViewChild('channelInput') channelInput: ElementRef<HTMLInputElement>;
  @ViewChild('formatInput') formatInput: ElementRef<HTMLInputElement>;
  @ViewChild('frequencyInput') frequencyInput: ElementRef<HTMLInputElement>;
  @ViewChild('localeInput') localeInput: ElementRef<HTMLInputElement>;

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
    this.inputCtrl = {
      contentTypeOptions: new FormControl(''),
      contentThemeOptions: new FormControl(''),
      channelOptions: new FormControl(''),
      formatOptions: new FormControl(''),
      frequencyOptions: new FormControl(''),
      localeOptions: new FormControl('')
    };
    super.ngOnInit();
  }

  protected initForm(): void {
    this.form = this.fb.group({
      type: [this.type, [Validators.required]],
      title: ['', [Validators.required]],
      body: ['', [Validators.required]],
      contentTypeOptions: [[], [Validators.required]],
      contentThemeOptions: [[], [Validators.required]],
      channelOptions: [[], [Validators.required]],
      formatOptions: [[], [Validators.required]],
      frequencyOptions: [[], [Validators.required]],
      localeOptions: [[], [Validators.required]]
    });
    this.initPreview();
  }

  addOption($event: MatChipInputEvent, option: string): void {
    const input = $event.input;
    const value = ($event.value || '').trim().toLowerCase();
    if (value) {
      const values: string[] = this.form.get(option).value || [];
      if (value.length > 0 && values.indexOf(value) === -1) {
        values.push(value);
        this.form.get(option).setValue(values);
      }
    }
    // Reset the input value
    if (input) {
      input.value = '';
    }
    this.inputCtrl[option].setValue('');
  }

  removeOption(value: string, option: string): void {
    const values: string[] = this.form.get(option).value || [];
    this.form.get(option).setValue(values.filter(t => t !== value));
  }

}
