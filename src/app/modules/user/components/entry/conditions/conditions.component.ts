import { Component, OnInit } from '@angular/core';
import { EntryCardContentDirective } from '../entry-card-content/entry-card-content.directive';
import { Conditions } from '../../../../../core/models/models';
import { TranslateService } from '@ngx-translate/core';
import { KeycloakService } from 'keycloak-angular';
import { ConsentsResourceService } from '../../../../../core/http/consents-resource.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AlertService } from '../../../../../core/services/alert.service';

@Component({
  selector: 'cm-conditions',
  templateUrl: './conditions.component.html',
  styleUrls: ['../entry-card/entry-card.component.scss', './conditions.component.scss']
})
export class ConditionsComponent extends EntryCardContentDirective<Conditions> implements OnInit {

  showDetails: boolean;

  get body(): SafeHtml {
    if (this.getData()?.body) {
      return this.sanitizer.bypassSecurityTrustHtml(this.getData().body);
    } else {
      return '';
    }
  }

  constructor(
    translate: TranslateService,
    keycloakService: KeycloakService,
    consentsResourceService: ConsentsResourceService,
    alertService: AlertService,
    private sanitizer: DomSanitizer
  ) {
    super(translate, keycloakService, consentsResourceService, alertService);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  enableControl(): void {
    if (this.remoteValue === 'accepted') {
      return;
    }
    this.control.enable({emitEvent: false});
  }

  parseValue(): any {
    const isAccepted = this.remoteValue === 'accepted';
    return {
      value: isAccepted,
      disabled: isAccepted
    };
  }

  serializeValue(): string {
    return this.control.value ? 'accepted' : 'refused';
  }
}
