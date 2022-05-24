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
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { EntryCardContentDirective } from '../entry-card-content/entry-card-content.directive';
import { getActiveVersion, ModelEntryDto, ModelVersionDto } from '@fairandsmart/consents-ce/models';
import { RecordDto } from '@fairandsmart/consents-ce/records';

@Component({
  selector: 'cm-entry-card',
  templateUrl: './entry-card.component.html',
  styleUrls: ['./entry-card.component.scss']
})
export class EntryCardComponent implements OnInit {

  @ViewChild('itemCard')
  itemCard: EntryCardContentDirective<any>;

  @Input()
  entry: ModelEntryDto;

  @Input()
  info: ModelEntryDto;

  active: ModelVersionDto<any>;

  @Input()
  recordsMap: { [key: string]: RecordDto };

  @Input()
  autoSave: boolean;

  @Output()
  unsavedChanged: EventEmitter<void>;

  constructor() {
    this.unsavedChanged = new EventEmitter<void>();
  }

  ngOnInit(): void {
    getActiveVersion(this.entry.id)
      .subscribe((version) => this.active = version);
  }

  notifyUnsavedChanges(): void {
    if (!this.autoSave) {
      this.unsavedChanged.emit();
    }
  }

}
