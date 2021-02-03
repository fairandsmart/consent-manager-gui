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
import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { EntriesListComponent } from '../entries-list/entries-list.component';
import { hasActiveVersion } from '../../../../../core/utils/model-entry.utils';

@Component({
  selector: 'cm-entries-list-drag-and-drop',
  templateUrl: './entries-list-drag-and-drop.component.html',
  styleUrls: ['../entries-list/entries-list.component.scss', './entries-list-drag-and-drop.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => EntriesListDragAndDropComponent),
      multi: true
    }
  ]
})
export class EntriesListDragAndDropComponent extends EntriesListComponent implements OnInit, ControlValueAccessor {

  private selected: ModelEntryDto[];

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

  isDisabled(entry: ModelEntryDto): boolean {
    return this.isSelected(entry) || !hasActiveVersion(entry) || !this.isLanguageCompatible(entry);
  }

  isLanguageCompatible(entry: ModelEntryDto): boolean {
    return entry.availableLanguages?.indexOf(this.configService.getDefaultLanguage()) > -1;
  }

  isSelected(entry: ModelEntryDto): boolean {
    return this.selected?.some(e => e.key === entry.key);
  }

  drop(event: CdkDragDrop<ModelEntryDto[]>): void {
    if (event.previousContainer !== event.container && this.section.types.includes(event.item.data.type)) {
      transferArrayItem(event.previousContainer.data, [], event.previousIndex, 0);
      this.onChange(this.selected);
    }
  }

  notDraggableReason(entry: ModelEntryDto): string {
    if (this.isSelected(entry)) {
      return 'ALERT.NOT_DRAGGABLE_REASONS.ALREADY_SELECTED';
    }
    if (!hasActiveVersion(entry)) {
      return'ALERT.NOT_DRAGGABLE_REASONS.NO_ACTIVE_VERSION';
    }
    if (!this.isLanguageCompatible(entry)) {
      return 'ALERT.NOT_DRAGGABLE_REASONS.BAD_LANGUAGE';
    }
    return null;
  }

}
