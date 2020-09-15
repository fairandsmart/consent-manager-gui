import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { ModelEntryDto } from '../models';

@Component({
  selector: 'app-entry-card',
  templateUrl: './entry-card.component.html',
  styleUrls: ['./entry-card.component.scss']
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

  constructor() { }

  ngOnInit(): void {
  }

}
