import { ChangeDetectionStrategy, Component, forwardRef, Input, OnInit } from '@angular/core';
import { EntriesComponent } from './entries.component';
import { ModelEntry } from '../models';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-entries-library-select',
  templateUrl: './entries-library-select.component.html',
  styleUrls: ['./entries.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => EntriesLibrarySelectComponent),
      multi: true
    }
  ]
})
export class EntriesLibrarySelectComponent extends EntriesComponent implements OnInit, ControlValueAccessor {

  private selected: {[type: string]: ModelEntry[]};

  @Input()
  multiple = false;

  @Input()
  disabled = false;

  private onChange = (value: {[type: string]: ModelEntry[]}) => {};

  private onTouched = () => {};

  ngOnInit(): void {
    super.ngOnInit();
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  writeValue(value: {[type: string]: ModelEntry[]}): void {
    this.selected = value;
    this.onChange(value);
  }

  isSelected(entry: ModelEntry): boolean {
    return this.selected?.[entry.type]?.some(e => e.key === entry.key);
  }

  select(entry: ModelEntry): void {
    if (this.isSelected(entry)) {
      this.selected[entry.type] = this.selected[entry.type].filter(e => e.key !== entry.key);
    } else {
      if (this.multiple) {
        this.selected[entry.type] = this.selected[entry.type].concat(entry);
      } else {
        this.selected[entry.type] = [entry];
      }
    }
    this.onChange(this.selected);
  }

}
