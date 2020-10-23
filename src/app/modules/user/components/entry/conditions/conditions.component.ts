import { Component, OnInit } from '@angular/core';
import { EntryCardContentDirective } from '../entry-card-content/entry-card-content.directive';
import { Conditions } from '../../../../../core/models/models';
import { TranslateService } from '@ngx-translate/core';
import { KeycloakService } from 'keycloak-angular';
import { ConsentsResourceService } from '../../../../../core/http/consents-resource.service';

@Component({
  selector: 'cm-conditions',
  templateUrl: './conditions.component.html',
  styleUrls: ['../entry-card/entry-card.component.scss', './conditions.component.scss']
})
export class ConditionsComponent extends EntryCardContentDirective<Conditions, boolean> implements OnInit {


  constructor(public translate: TranslateService,
              protected keycloakService: KeycloakService,
              protected consentsResourceService: ConsentsResourceService) {
    super(translate, keycloakService, consentsResourceService);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  parseValue(): boolean {
    return this.record.value === 'accepted';
  }

  serializeValue(): string {
    return this.record.value ? 'accepted' : 'refused';
  }

  toggle(e): void {
    this.saveChanges();
  }

}
