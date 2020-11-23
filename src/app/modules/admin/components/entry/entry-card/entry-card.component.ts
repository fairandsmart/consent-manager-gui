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
