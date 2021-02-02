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
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { CollectionPage, Icons, ModelDataType, ModelEntryDto, ModelFilter } from '../../../../../core/models/models';
import { ModelsResourceService } from '../../../../../core/http/models-resource.service';
import { CollectionDatasource } from '../../../utils/collection-datasource';

export class ConsentElementEntryDataSource extends CollectionDatasource<ModelEntryDto, ModelFilter> {

  constructor(private modelsResource: ModelsResourceService) {
    super();
  }

  protected getPage(pageFilter: ModelFilter): Observable<CollectionPage<ModelEntryDto>> {
    return this.modelsResource.listEntries(pageFilter);
  }

}

export enum AddMultipleOption {
  ALWAYS = 'ALWAYS',
  NEVER = 'NEVER',
  ENTERPRISE = 'ENTERPRISE'
}

export interface SectionConfig {
  id: string;
  types: ModelDataType[];
  canAddMultiple: AddMultipleOption;
  showSort: boolean;
  filter?: ModelFilter;
  dataSource?: ConsentElementEntryDataSource;
  orderingOptions?: (keyof ModelEntryDto)[];
  icon?: Icons;
  displayDescription: boolean;
  columns?: number;
  listId?: string;
}

@Component({
  selector: 'cm-entries-library',
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
  expandable = true;

  @Input()
  selected: {[id: string]: ModelEntryDto[]};

  @Output()
  selectedChange = new EventEmitter<{[id: string]: ModelEntryDto[]}>();

  @Input()
  showKeys = false;

  constructor() {}

  ngOnInit(): void {
  }

  selectedEntriesChange(section: SectionConfig, event: ModelEntryDto[]): void {
    this.selected[section.listId ? section.listId : section.id] = event;
    this.selectedChange.emit(this.selected);
  }

}
