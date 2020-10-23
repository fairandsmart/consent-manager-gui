import { Component, OnInit, SimpleChanges } from '@angular/core';
import { EntryCardContentDirective } from '../entry-card-content/entry-card-content.directive';
import {
  CollectionMethod,
  ConsentContext,
  ConsentFormOrientation, ConsentFormType,
  Preference,
  PreferenceValueType
} from '../../../../../core/models/models';
import { TranslateService } from '@ngx-translate/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged, filter, skip, startWith } from 'rxjs/operators';
import { KeycloakService } from 'keycloak-angular';
import { ConsentsResourceService } from '../../../../../core/http/consents-resource.service';

@Component({
  selector: 'cm-preference',
  templateUrl: './preference.component.html',
  styleUrls: ['../entry-card/entry-card.component.scss', './preference.component.scss']
})
export class PreferenceComponent extends EntryCardContentDirective<Preference, FormGroup> implements OnInit {

  showDetails: boolean;
  private saveDelay = 500;

  constructor(private fb: FormBuilder, public translate: TranslateService,
              protected keycloakService: KeycloakService,
              protected consentsResourceService: ConsentsResourceService) {
    super(translate, keycloakService, consentsResourceService);
  }

  ngOnInit(): void {
    this.value = this.parseValue();
    this.initSaves();
    this.patchValues();
  }

  patchValues(): void {
    if (this.record) {
      const valueType: PreferenceValueType = this.getData().valueType;
      if (valueType === 'FREE_TEXT' || valueType === 'RADIO_BUTTONS' || valueType === 'LIST_SINGLE') {
        this.value.get('answer').patchValue(this.record.value);
      } else if (valueType === 'LIST_MULTI') {
        this.value.get('answersList').patchValue(this.record.value.split(','));
      } else if (valueType === 'TOGGLE') {
        if (this.record.value === this.getData().options[1]) {
          this.value.get('answer').patchValue(this.getData().options[1]);
        } else {
          this.value.get('answer').patchValue(this.getData().options[0]);
        }
      } else if (valueType === 'CHECKBOXES') {
        const valuesList = this.record.value.split(',');
        const answersArray = this.value.get('answersArray') as FormArray;
        const options = this.getData().options;
        for (let index = 0; index < options.length; index++) {
          answersArray.at(index).patchValue(valuesList.includes(options[index]));
        }
      }
    }
  }

  initSaves(): void {
    this.value.valueChanges.pipe(
      distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
      skip(1),
      debounceTime(this.saveDelay)
    ).subscribe((changes) => {
      console.log(changes);
      console.log('should save', this.entry.key);
      this.value.disable(); // triggers valueChanges, hence distinctUntilChanged
      this.saveChanges();
    });
  }

  saved(err: Error) {
    this.value.enable();
    if (err) {
      this.initSaves();
    }
  }

  parseValue(): FormGroup {
    const form = this.fb.group({
      answer: [''],
      answersList: [[]],
      answersArray: this.fb.array([])
    });
    if (this.getData().valueType === 'CHECKBOXES') {
      const answersArray = form.get('answersArray') as FormArray;
      this.getData().options.forEach(() => answersArray.push(this.fb.control(false)));
    }
    return form;
  }

  serializeValue(): string {
    const rawValues = this.value.getRawValue();
    const valueType: PreferenceValueType = this.getData().valueType;
    const options = this.getData().options;
    let value;
    if (valueType === 'FREE_TEXT' || valueType === 'RADIO_BUTTONS' || valueType === 'LIST_SINGLE') {
      value = rawValues.answer;
    } else if (valueType === 'LIST_MULTI') {
      value = rawValues.answersList.join(',');
    } else if (valueType === 'TOGGLE') {
      value = rawValues.answer ? options[1] : options[0];
    } else if (valueType === 'CHECKBOXES') {
      const valuesList = [];
      for (let index = 0; index < options.length; index++) {
        if (rawValues.answersArray[index]) {
          valuesList.push(options[index]);
        }
      }
      value = valuesList.join(',');
    }
    console.log(value);
    return value;
  }


}
