import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { CollectionPage, ModelDataType, ModelEntry, ModelFilter } from '../../models';
import { ModelsResourceService } from '../../models-resource.service';
import { CollectionDatasource } from '../../common/collection-datasource';

export class ConsentElementEntryDataSource extends CollectionDatasource<ModelEntry, ModelFilter> {

  constructor(private modelsResource: ModelsResourceService) {
    super();
  }

  protected getPage(pageFilter: ModelFilter): Observable<CollectionPage<ModelEntry>> {
    return this.modelsResource.listEntries(pageFilter);
  }

}

export interface SectionConfig {
  id: string;
  types: ModelDataType[];
  multiple: boolean;
  showSort: boolean;
  filter?: ModelFilter;
  dataSource?: ConsentElementEntryDataSource;
  orderingOptions?: (keyof ModelEntry)[];
}

@Component({
  selector: 'app-entries-library',
  templateUrl: './entries-library.component.html',
  styleUrls: ['./entries-library.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EntriesLibraryComponent implements OnInit {

  // tslint:disable-next-line:no-input-rename
  @Input('config')
  sections: SectionConfig[];

  @Input()
  mode: 'view' | 'select' | 'drag' = 'view';

  @Input()
  selected: {[id: string]: ModelEntry[]};

  @Output()
  selectedChange = new EventEmitter<{[id: string]: ModelEntry[]}>();

  constructor() {}

  ngOnInit(): void {
  }

  selectedEntriesChange(section: SectionConfig, event: ModelEntry[]): void {
    this.selected[section.id] = event;
    this.selectedChange.emit(this.selected);
  }

}
