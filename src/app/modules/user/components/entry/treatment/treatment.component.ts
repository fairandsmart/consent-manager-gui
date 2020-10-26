import { Component, OnInit } from '@angular/core';
import { EntryCardContentDirective } from '../entry-card-content/entry-card-content.directive';
import { Treatment } from '../../../../../core/models/models';
import { TranslateService } from '@ngx-translate/core';
import { ConsentsResourceService } from '../../../../../core/http/consents-resource.service';
import { KeycloakService } from 'keycloak-angular';
import { AlertService } from '../../../../../core/services/alert.service';

@Component({
  selector: 'cm-treatment',
  templateUrl: './treatment.component.html',
  styleUrls: ['../entry-card/entry-card.component.scss', './treatment.component.scss']
})
export class TreatmentComponent extends EntryCardContentDirective<Treatment> implements OnInit {

  showDetails: boolean;

  constructor(
    translate: TranslateService,
    keycloakService: KeycloakService,
    consentsResourceService: ConsentsResourceService,
    alertService: AlertService
  ) {
    super(translate, keycloakService, consentsResourceService, alertService);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  parseValue(): boolean {
    return this.record && this.record.value === 'accepted';
  }

  serializeValue(): string {
    return this.control.value ? 'accepted' : 'refused';
  }

}
