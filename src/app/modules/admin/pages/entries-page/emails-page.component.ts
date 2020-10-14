import { Component } from '@angular/core';
import { SectionConfig } from '../../components/entries/entries-library/entries-library.component';

@Component({
  selector: 'cm-email-page',
  template: `
    <cm-entries-library [config]="config" [expandable]="false"></cm-entries-library>
  `
})
export class EmailsPageComponent {

  public config: SectionConfig[] = [
    {
      id: 'emails',
      types: ['email'],
      multiple: true,
      showSort: true
    }
  ];

  constructor() { }

}
