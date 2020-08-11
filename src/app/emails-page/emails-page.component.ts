import { Component } from '@angular/core';
import { SectionConfig } from '../entries/entries-library/entries-library.component';

@Component({
  selector: 'app-email-page',
  template: `
    <app-entries-library [config]="config"></app-entries-library>
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
