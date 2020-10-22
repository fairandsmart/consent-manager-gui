import { Component, OnInit } from '@angular/core';
import { EntryCardContentDirective } from '../entry-card-content/entry-card-content.directive';
import { Preference, PreferenceValueType } from '../../../../../core/models/models';
import { TranslateService } from '@ngx-translate/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime, startWith } from 'rxjs/operators';

@Component({
  selector: 'cm-preference',
  templateUrl: './preference.component.html',
  styleUrls: ['../entry-card/entry-card.component.scss', './preference.component.scss']
})
export class PreferenceComponent extends EntryCardContentDirective<Preference> implements OnInit {

  private saveDelay = 500;
  form: FormGroup;

  constructor(private fb: FormBuilder, public translate: TranslateService) {
    super(translate);
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      answer: [''],
      answersList: [[]],
      answersArray: this.fb.array([])
    });
    if (this.getData().valueType === 'CHECKBOXES') {
      const answersArray = this.form.get('answersArray') as FormArray;
      this.getData().options.forEach(() => answersArray.push(this.fb.control(false)));
    }
    this.patchValues();
    this.initSaves();
  }

  patchValues(): void {
    if (this.record) {
      const valueType: PreferenceValueType = this.getData().valueType;
      if (valueType === 'FREE_TEXT' || valueType === 'RADIO_BUTTONS' || valueType === 'LIST_SINGLE') {
        this.form.get('answer').patchValue(this.record.value);
      } else if (valueType === 'LIST_MULTI') {
        this.form.get('answersList').patchValue(this.record.value.split(','));
      } else if (valueType === 'TOGGLE') {
        if (this.record.value === this.getData().options[1]) {
          this.form.get('answer').patchValue(this.getData().options[1]);
        } else {
          this.form.get('answer').patchValue(this.getData().options[0]);
        }
      } else if (valueType === 'CHECKBOXES') {
        const valuesList = this.record.value.split(',');
        const answersArray = this.form.get('answersArray') as FormArray;
        const options = this.getData().options;
        for (let index = 0; index < options.length; index++) {
          answersArray.at(index).patchValue(valuesList.includes(options[index]));
        }
      }
    }
  }

  initSaves(): void {
    this.form.valueChanges.pipe(
      startWith(this.form.getRawValue() as Preference),
      debounceTime(this.saveDelay)
    ).subscribe(() => {
      const rawValues = this.form.getRawValue();
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
      if (value) {
        console.log('TODO save changes', value);
      }
    });
  }

}
