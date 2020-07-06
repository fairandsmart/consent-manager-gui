import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { ModelEntry } from '../models';

@Component({
  selector: 'app-entry-card',
  templateUrl: './entry-card.component.html',
  styleUrls: ['./entry-card.component.scss']
})
export class EntryCardComponent implements OnInit {

  @Input()
  entry: ModelEntry;

  @Input()
  @HostBinding('class.entry-card-selectable')
  selectable: boolean;

  constructor() { }

  ngOnInit(): void {
  }

}
