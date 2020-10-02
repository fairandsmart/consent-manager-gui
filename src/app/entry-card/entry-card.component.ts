import { ChangeDetectionStrategy, Component, HostBinding, Input, OnInit } from '@angular/core';
import { ModelEntryDto, ModelVersionStatus } from '../models';
import * as _ from 'lodash';

@Component({
  selector: 'app-entry-card',
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
    return this.entry.versions.some(v => v.status === ModelVersionStatus.ACTIVE);
  }

  languages(): string {
    return _.last(this.entry.versions)?.availableLocales.join(' | ');
  }

}
