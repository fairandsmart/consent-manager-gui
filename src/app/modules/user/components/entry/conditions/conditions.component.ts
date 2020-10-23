import { Component, OnInit } from '@angular/core';
import { EntryCardContentDirective } from '../entry-card-content/entry-card-content.directive';
import { Conditions } from '../../../../../core/models/models';
import { TranslateService } from '@ngx-translate/core';
import { KeycloakService } from 'keycloak-angular';
import { ConsentsResourceService } from '../../../../../core/http/consents-resource.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'cm-conditions',
  templateUrl: './conditions.component.html',
  styleUrls: ['../entry-card/entry-card.component.scss', './conditions.component.scss']
})
export class ConditionsComponent extends EntryCardContentDirective<Conditions, boolean> implements OnInit {
  showDetails: boolean;

  get body(): SafeHtml {
    if (this.getData()?.body) {
      return this.sanitizer.bypassSecurityTrustHtml(this.getData().body);
    } else {
      return '';
    }
  }

  constructor(
    public translate: TranslateService,
    protected keycloakService: KeycloakService,
    protected consentsResourceService: ConsentsResourceService,
    private sanitizer: DomSanitizer,
  ) {
    super(translate, keycloakService, consentsResourceService);
  }

  ngOnInit(): void {
    console.log(this.entry);
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
