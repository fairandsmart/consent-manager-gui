/*-
 * #%L
 * Right Consents, a Universal Consents & Preferences Management Platform.
 * %%
 * Copyright (C) 2020 - 2021 Fair And Smart
 * %%
 * This file is part of Right Consents Community Edition.
 * 
 * Right Consents Community Edition is published by FAIR AND SMART under the
 * GNU GENERAL PUBLIC LICENCE Version 3 (GPLv3) and a set of additional terms.
 * 
 * For more information, please see the “LICENSE” and “LICENSE.FAIRANDSMART”
 * files, or see https://www.fairandsmart.com/opensource/.
 * #L%
 */
import { ChangeDetectionStrategy, Component, forwardRef, Input, OnInit } from '@angular/core';
import { ModelEntryDto } from '../../../../../core/models/models';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { EntriesListComponent } from '../entries-list/entries-list.component';
import { hasActiveVersion } from '../../../../../core/utils/model-entry.utils';

@Component({
  selector: 'cm-entries-list-select',
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
    return hasActiveVersion(entry);
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
