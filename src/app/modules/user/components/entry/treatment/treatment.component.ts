import { Component, OnInit } from '@angular/core';
import { EntryCardContentDirective } from '../entry-card-content/entry-card-content.directive';
import { Treatment  } from '../../../../../core/models/models';
import { TranslateService } from '@ngx-translate/core';
import { ConsentsResourceService } from '../../../../../core/http/consents-resource.service';
import { KeycloakService } from 'keycloak-angular';
@Component({
  selector: 'cm-treatment',
  templateUrl: './treatment.component.html',
  styleUrls: ['../entry-card/entry-card.component.scss', './treatment.component.scss']
})
export class TreatmentComponent extends EntryCardContentDirective<Treatment, boolean> implements OnInit {

  showDetails: boolean;

  constructor(
    public translate: TranslateService,
    protected keycloakService: KeycloakService,
    protected consentsResourceService: ConsentsResourceService,
  ) {
    super(translate, keycloakService, consentsResourceService);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  parseValue(): boolean {
    return this.record && this.record.value === 'accepted';
  }

  serializeValue(): string {
    return this.value ? 'accepted' : 'refused';
  }

  toggle(e): void {
    this.saveChanges();
  }

}
