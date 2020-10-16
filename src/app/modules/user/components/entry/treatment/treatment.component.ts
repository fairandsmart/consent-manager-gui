import { Component, OnInit } from '@angular/core';
import { EntryCardContentDirective } from '../entry-card-content/entry-card-content.directive';
import { Treatment } from '../../../../../core/models/models';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'cm-treatment',
  templateUrl: './treatment.component.html',
  styleUrls: ['../entry-card/entry-card.component.scss', './treatment.component.scss']
})
export class TreatmentComponent extends EntryCardContentDirective<Treatment> implements OnInit {

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
