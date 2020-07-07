import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { EntriesComponent } from './entries.component';
import { ModelDataType, ModelEntry } from '../models';
import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-entries-library',
  templateUrl: './entries-library.component.html',
  styleUrls: ['./entries.component.scss', './entries-library.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EntriesLibraryComponent extends EntriesComponent {

  @Input()
  selected: {[type: string]: ModelEntry[]};

  @Output()
  changes = new EventEmitter<{type: ModelDataType}>();

  isDisabled(entry: ModelEntry): boolean {
    return this.selected?.[entry.type]?.some(e => e.key === entry.key);
  }

  drop(event: CdkDragDrop<ModelEntry[]>) {
    if (event.previousContainer !== event.container) {
      const type = event.previousContainer.data[0].type;
      transferArrayItem(event.previousContainer.data, [], event.previousIndex, 0);
      this.changes.emit({type});
    }
  }

}
