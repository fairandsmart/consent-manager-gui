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
import { listEntries, ModelDataType, ModelEntryDto, ModelFilter } from '@fairandsmart/consent-manager/models';
import { CollectionDatasource } from '../../../utils/collection-datasource';
import { Icons } from '../../../../../core/models/common';
import { CollectionPage } from '@fairandsmart/consent-manager';

export class ConsentElementEntryDataSource extends CollectionDatasource<ModelEntryDto, ModelFilter> {

  constructor() {
    super();
  }

  protected getPage(pageFilter: ModelFilter): Observable<CollectionPage<ModelEntryDto>> {
    return listEntries(pageFilter);
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
  showActions: boolean;
  filter?: ModelFilter;
  dataSource?: ConsentElementEntryDataSource;
  orderingOptions?: (keyof ModelEntryDto)[];
  icon?: Icons;
  fullSize: boolean;
  columns?: number;
  listId?: string;
  persistFilters?: boolean;
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

  constructor() {}

  ngOnInit(): void {}

  selectedEntriesChange(section: SectionConfig, event: ModelEntryDto[]): void {
    this.selected[section.listId ? section.listId : section.id] = event;
    this.selectedChange.emit(this.selected);
  }

}
