import { ChangeDetectionStrategy, Component, forwardRef, Input, OnInit } from '@angular/core';
import { EntriesComponent } from './entries.component';
import { ModelEntry } from '../models';
import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-entries-library-drag-and-drop',
  templateUrl: './entries-library-drag-and-drop.component.html',
  styleUrls: ['./entries.component.scss', './entries-library-drag-and-drop.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => EntriesLibraryDragAndDropComponent),
      multi: true
    }
  ]
})
export class EntriesLibraryDragAndDropComponent extends EntriesComponent implements OnInit, ControlValueAccessor {

  private selected: {[type: string]: ModelEntry[]};

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

  isDisabled(entry: ModelEntry): boolean {
    return this.isSelected(entry); // TODO disable if no active version
  }

  isSelected(entry: ModelEntry): boolean {
    return this.selected?.[entry.type]?.some(e => e.key === entry.key);
  }

  drop(event: CdkDragDrop<ModelEntry[]>) {
    if (event.previousContainer !== event.container) {
      transferArrayItem(event.previousContainer.data, [], event.previousIndex, 0);
      this.onChange(this.selected);
    }
  }

}
