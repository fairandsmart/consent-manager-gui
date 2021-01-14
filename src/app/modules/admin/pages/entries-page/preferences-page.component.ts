import {Component} from '@angular/core';
import {AddMultipleOption, SectionConfig} from '../../components/entries/entries-library/entries-library.component';
import {Icons} from '../../../../core/models/models';

@Component({
  selector: 'cm-preferences-page',
  template: `
    <cm-entries-library [config]="config" [expandable]="false"></cm-entries-library>
  `,
  styleUrls: ['./_entries-page.scss']
})
export class PreferencesPageComponent {

  public config: SectionConfig[] = [
    {
      id: 'preferences',
      types: ['preference'],
      canAddMultiple: AddMultipleOption.ALWAYS,
      showSort: true,
      icon: Icons.preference,
      displayDescription: true
    }
  ];

  constructor() { }

}
