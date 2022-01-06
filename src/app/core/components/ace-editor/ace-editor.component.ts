import { Component, forwardRef, Input } from '@angular/core';
import { AbstractControl, ControlValueAccessor, NG_VALUE_ACCESSOR, ValidationErrors, Validator } from '@angular/forms';
import { AceConfigInterface } from 'ngx-ace-wrapper';
import 'brace';
import 'brace-extra';
import 'brace/ext/language_tools';
import 'brace/mode/text';
import 'brace/mode/json';
import 'brace/mode/css';
import 'brace/mode/html';
import 'brace/theme/eclipse';

@Component({
  selector: 'cm-ace-editor',
  template: `
    <ace style="display: grid" [style.minHeight]="(height || 500) + 'px'" [config]="config" [mode]="mode" [theme]="theme" [disabled]="disabled" [value]="value" (valueChange)="valueChange($event)"></ace>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => AceEditorComponent),
    }
  ]
})
export class AceEditorComponent implements ControlValueAccessor, Validator {
  @Input() config: AceConfigInterface;
  @Input() mode: string;
  @Input() theme: string;
  @Input() disabled: boolean;
  @Input() height: number;
  @Input() required: boolean;

  onChange;
  onTouched;
  onValidatorChange;
  value: '';
  init = false;

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  valueChange(value): void {
    if (this.init && this.value !== value) {
      this.value = value;
      this.onChange(this.value);
      this.onTouched();
    }
    this.init = true;
  }

  writeValue(obj: any): void {
    // Hack to circumvent the value change dirtying the form on init
    this.init = false;
    this.value = obj;
  }

  registerOnValidatorChange(fn: () => void): void {
    this.onValidatorChange = fn;
  }

  validate(control: AbstractControl): ValidationErrors | null {
    if (this.required && !this.value || this.value.length === 0) {
      return {required: true};
    }
    return null;
  }


}
