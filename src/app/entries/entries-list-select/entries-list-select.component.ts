import { ChangeDetectionStrategy, Component, forwardRef, Input, OnInit } from '@angular/core';
import { ModelEntryDto, ModelVersionStatus } from '../../models';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { EntriesListComponent } from '../entries-list/entries-list.component';

@Component({
  selector: 'app-entries-list-select',
  templateUrl: './entries-list-select.component.html',
  styleUrls: ['../entries-list/entries-list.component.scss', './entries-list-select.component.scss'],
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

  private selected: ModelEntryDto[];

  @Input()
  multiple = false;

  @Input()
  disabled = false;

  private onChange = (value: ModelEntryDto[]) => {};

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

  writeValue(value: ModelEntryDto[]): void {
    this.selected = value;
    this.onChange(value);
    this.ref.markForCheck();
  }

  isSelectable(entry: ModelEntryDto): boolean {
    return entry.versions.find(v => v.status === ModelVersionStatus.ACTIVE) !== undefined;
  }

  isSelected(entry: ModelEntryDto): boolean {
    return this.selected?.some(e => e.key === entry.key);
  }

  select(entry: ModelEntryDto): void {
    if (this.isSelected(entry)) {
      this.selected = this.selected.filter(e => e.key !== entry.key);
    } else if (this.isSelectable(entry)) {
      if (this.multiple) {
        this.selected = this.selected.concat(entry);
      } else {
        this.selected = [entry];
      }
    }
    this.onChange(this.selected);
  }

}
