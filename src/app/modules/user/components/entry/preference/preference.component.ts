import { Component, OnInit } from '@angular/core';
import { EntryCardContentDirective } from '../entry-card-content/entry-card-content.directive';
import { Preference } from '../../../../../core/models/models';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'cm-preference',
  templateUrl: './preference.component.html',
  styleUrls: ['../entry-card/entry-card.component.scss', './preference.component.scss']
})
export class PreferenceComponent extends EntryCardContentDirective<Preference> implements OnInit {

  constructor(public translate: TranslateService) {
    super(translate);
  }

  ngOnInit(): void {
  }

  toggle(e): void {
    console.log(e);
    // TODO user : submit e.checked
  }

}
