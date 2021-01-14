import {Component} from '@angular/core';
import {AddMultipleOption, SectionConfig} from '../../components/entries/entries-library/entries-library.component';
import {Icons} from '../../../../core/models/models';

@Component({
  selector: 'cm-email-page',
  template: `
    <cm-entries-library [config]="config" [expandable]="false"></cm-entries-library>
  `,
  styleUrls: ['./_entries-page.scss']
})
export class EmailsPageComponent {

  public config: SectionConfig[] = [
    {
      id: 'emails',
      types: ['email'],
      canAddMultiple: AddMultipleOption.ALWAYS,
      showSort: true,
      icon: Icons.email,
      displayDescription: true
    }
  ];

  constructor() { }

}
