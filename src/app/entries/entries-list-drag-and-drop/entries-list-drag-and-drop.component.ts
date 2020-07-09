import { ChangeDetectionStrategy, Component, forwardRef, Input, OnInit } from '@angular/core';
import { ModelEntry } from '../../models';
import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { EntriesListComponent } from '../entries-list/entries-list.component';

@Component({
  selector: 'app-entries-list-drag-and-drop',
  templateUrl: './entries-list-drag-and-drop.component.html',
  styleUrls: ['../entries-list/entries-list.component.scss', './entries-list-drag-and-drop.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => EntriesListDragAndDropComponent),
      multi: true
    }
  ]
})
export class EntriesListDragAndDropComponent extends EntriesListComponent implements OnInit, ControlValueAccessor {

  private selected: ModelEntry[];

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

  isDisabled(entry: ModelEntry): boolean {
    return this.isSelected(entry); // TODO disable if no active version
  }

  isSelected(entry: ModelEntry): boolean {
    return this.selected?.some(e => e.key === entry.key);
  }

  drop(event: CdkDragDrop<ModelEntry[]>) {
    if (event.previousContainer !== event.container) {
      transferArrayItem(event.previousContainer.data, [], event.previousIndex, 0);
      this.onChange(this.selected);
    }
  }

}
