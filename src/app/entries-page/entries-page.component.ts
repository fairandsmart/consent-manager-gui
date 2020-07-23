import { Component } from '@angular/core';
import { environment } from '../../environments/environment';
import { SectionConfig } from '../entries/entries-library/entries-library.component';

@Component({
  selector: 'app-entries-page',
  template: `
    <app-entries-library [config]="config"></app-entries-library>
  `
})
export class EntriesPageComponent {

  public config: SectionConfig[] = [
    {
      id: 'headers',
      types: ['header'],
      multiple: environment.customization.multipleHeader,
      showSort: environment.customization.multipleHeader
    },
    {
      id: 'treatments',
      types: ['treatment'],
      multiple: true,
      showSort: true
    },
    {
      id: 'footers',
      types: ['footer'],
      multiple: environment.customization.multipleFooter,
      showSort: environment.customization.multipleFooter
    },
  ];

  constructor() { }

}
