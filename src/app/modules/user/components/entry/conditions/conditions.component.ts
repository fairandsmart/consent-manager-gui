import { Component, OnInit } from '@angular/core';
import { EntryCardContentDirective } from '../entry-card-content/entry-card-content.directive';
import { Conditions } from '../../../../../core/models/models';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'cm-conditions',
  templateUrl: './conditions.component.html',
  styleUrls: ['../entry-card/entry-card.component.scss', './conditions.component.scss']
})
export class ConditionsComponent extends EntryCardContentDirective<Conditions> implements OnInit {

  value: boolean;

  constructor(public translate: TranslateService) {
    super(translate);
  }

  ngOnInit(): void {
    if (this.record) {
      this.value = this.record.value === 'accepted';
    }
  }

  toggle(e): void {
    console.log(e);
    // TODO user : submit e.checked
  }

}
