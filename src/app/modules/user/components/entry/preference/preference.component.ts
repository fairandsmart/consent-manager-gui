import { Component, OnInit } from '@angular/core';
import { EntryCardContentDirective } from '../entry-card-content/entry-card-content.directive';
import { Preference, PreferenceValueType } from '../../../../../core/models/models';
import { TranslateService } from '@ngx-translate/core';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { KeycloakService } from 'keycloak-angular';
import { ConsentsResourceService } from '../../../../../core/http/consents-resource.service';
import { AlertService } from '../../../../../core/services/alert.service';

@Component({
  selector: 'cm-preference',
  templateUrl: './preference.component.html',
  styleUrls: ['../entry-card/entry-card.component.scss', './preference.component.scss']
})
export class PreferenceComponent extends EntryCardContentDirective<Preference> implements OnInit {

  private saveDelay = 500;

  readonly TYPES = PreferenceValueType;

  checkboxesGroup: FormGroup;

  constructor(
    translate: TranslateService,
    keycloakService: KeycloakService,
    consentsResourceService: ConsentsResourceService,
    alertService: AlertService
  ) {
    super(translate, keycloakService, consentsResourceService, alertService);
  }

  ngOnInit(): void {
    this.remoteValue = this.record?.value;
    const state = this.parseValue();
    if (this.getData().valueType === PreferenceValueType.CHECKBOXES) {
      this.checkboxesGroup = new FormGroup({});
      this.getData().options.forEach(o => {
        this.checkboxesGroup.addControl(o, new FormControl(state.indexOf(o) !== -1));
      });
      this.checkboxesGroup.valueChanges.subscribe(v => {
        const checkedValues = Object.keys(v).filter(o => v[o]);
        this.control.setValue(checkedValues);
      });
    }
    this.control = new FormControl(state);
    this.control.valueChanges.pipe(
      debounceTime(this.saveDelay)
    ).subscribe(e => {
      this.saveChanges();
    });
  }

  enableControl(): void {
    super.enableControl();
    this.checkboxesGroup?.enable({emitEvent: false});
  }

  disableControl(): void {
    super.disableControl();
    this.checkboxesGroup?.disable({emitEvent: false});
  }

  parseValue(): any {
    switch (this.getData().valueType) {
      case PreferenceValueType.FREE_TEXT:
      case PreferenceValueType.RADIO_BUTTONS:
      case PreferenceValueType.LIST_SINGLE:
        return this.record?.value;
      case PreferenceValueType.LIST_MULTI:
      case PreferenceValueType.CHECKBOXES:
        return this.record?.value.split(',') ?? [];
      case PreferenceValueType.TOGGLE:
        return this.record?.value === this.getData().options[1];
    }
  }

  serializeValue(): string {
    switch (this.getData().valueType) {
      case PreferenceValueType.FREE_TEXT:
      case PreferenceValueType.RADIO_BUTTONS:
      case PreferenceValueType.LIST_SINGLE:
        return this.control.value;
      case PreferenceValueType.LIST_MULTI:
      case PreferenceValueType.CHECKBOXES:
        return this.control.value.join(',');
      case PreferenceValueType.TOGGLE:
        return this.control.value ? this.getData().options[1] : this.getData().options[0];
    }
  }

}
