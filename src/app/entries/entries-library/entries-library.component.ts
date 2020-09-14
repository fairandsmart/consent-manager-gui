import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { CollectionPage, ModelDataType, ModelEntry, ModelEntryDto, ModelFilter } from '../../models';
import { ModelsResourceService } from '../../models-resource.service';
import { CollectionDatasource } from '../../common/collection-datasource';

export class ConsentElementEntryDataSource extends CollectionDatasource<ModelEntryDto, ModelFilter> {

  constructor(private modelsResource: ModelsResourceService) {
    super();
  }

  protected getPage(pageFilter: ModelFilter): Observable<CollectionPage<ModelEntryDto>> {
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
  selected: {[id: string]: ModelEntryDto[]};

  @Output()
  selectedChange = new EventEmitter<{[id: string]: ModelEntryDto[]}>();

  constructor() {}

  ngOnInit(): void {
  }

  selectedEntriesChange(section: SectionConfig, event: ModelEntryDto[]): void {
    this.selected[section.id] = event;
    this.selectedChange.emit(this.selected);
  }

}
