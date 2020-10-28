import { Component, OnInit } from '@angular/core';
import { EntryCardContentDirective } from '../entry-card-content/entry-card-content.directive';
import { Processing } from '../../../../../core/models/models';
import { TranslateService } from '@ngx-translate/core';
import { ConsentsResourceService } from '../../../../../core/http/consents-resource.service';
import { KeycloakService } from 'keycloak-angular';
import { AlertService } from '../../../../../core/services/alert.service';

@Component({
  selector: 'cm-processing',
  templateUrl: './processing.component.html',
  styleUrls: ['../entry-card/entry-card.component.scss', './processing.component.scss']
})
export class ProcessingComponent extends EntryCardContentDirective<Processing> implements OnInit {

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
    return this.remoteValue === 'accepted';
  }

  serializeValue(): string {
    return this.control.value ? 'accepted' : 'refused';
  }

}
