import { Component } from '@angular/core';
import {AddMultipleOption, SectionConfig} from '../../../components/entries/entries-library/entries-library.component';
import {Icons} from '../../../../../core/models/models';

@Component({
  selector: 'cm-conditions-page',
  template: `
    <cm-entries-library [config]="config" [expandable]="false"></cm-entries-library>
  `,
  styleUrls: ['./_entries-page.scss']
})
export class ConditionsPageComponent {

  public config: SectionConfig[] = [
    {
      id: 'conditions',
      types: ['conditions'],
      canAddMultiple: AddMultipleOption.ALWAYS,
      showSort: true,
      icon: Icons.conditions,
      displayDescription: true
    }
  ];

  constructor() { }

}
