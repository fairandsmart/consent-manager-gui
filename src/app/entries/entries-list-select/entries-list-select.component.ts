import { ChangeDetectionStrategy, Component, forwardRef, Input, OnInit } from '@angular/core';
import { ModelEntry } from '../../models';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { EntriesListComponent } from '../entries-list/entries-list.component';

@Component({
  selector: 'app-entries-list-select',
  templateUrl: './entries-list-select.component.html',
  styleUrls: ['../entries-list/entries-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => EntriesListSelectComponent),
      multi: true
    }
  ]
})
export class EntriesListSelectComponent extends EntriesListComponent implements OnInit, ControlValueAccessor {

  private selected: ModelEntry[];

  @Input()
  multiple = false;

  @Input()
  disabled = false;

  private onChange = (value: ModelEntry[]) => {};

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

  writeValue(value: ModelEntry[]): void {
    this.selected = value;
    this.onChange(value);
    this.ref.markForCheck();
  }

  isSelected(entry: ModelEntry): boolean {
    return this.selected?.some(e => e.key === entry.key);
  }

  select(entry: ModelEntry): void {
    if (this.isSelected(entry)) {
      this.selected = this.selected.filter(e => e.key !== entry.key);
    } else {
      if (this.multiple) {
        this.selected = this.selected.concat(entry);
      } else {
        this.selected = [entry];
      }
    }
    this.onChange(this.selected);
  }

}
