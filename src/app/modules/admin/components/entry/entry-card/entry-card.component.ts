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
import { ChangeDetectionStrategy, Component, HostBinding, Input, OnInit } from '@angular/core';
import { ModelEntryDto } from '../../../../../core/models/models';
import * as _ from 'lodash';
import { hasActiveVersion } from '../../../../../core/utils/model-entry.utils';

@Component({
  selector: 'cm-entry-card',
  templateUrl: './entry-card.component.html',
  styleUrls: ['./entry-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EntryCardComponent implements OnInit {

  @Input()
  entry: ModelEntryDto;

  @Input()
  @HostBinding('class.entry-card-selectable')
  selectable = true;

  @Input()
  @HostBinding('class.entry-card-selected')
  selected: boolean;

  @Input()
  showDetail = false;

  @Input()
  showKey = true;

  constructor() { }

  ngOnInit(): void {
  }

  hasActiveVersion(): boolean {
    return hasActiveVersion(this.entry);
  }

  languages(): string {
    return _.last(this.entry.versions)?.availableLanguages.join(' | ');
  }

}
