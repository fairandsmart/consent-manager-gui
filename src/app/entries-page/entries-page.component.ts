import { Component } from '@angular/core';
import { environment } from '../../environments/environment';
import { SectionConfig } from '../entries/entries.component';

@Component({
  selector: 'app-entries-page',
  template: `
    <app-entries [config]="config"></app-entries>
  `
})
export class EntriesPageComponent {

  public config: SectionConfig[] = [
    {
      type: 'header',
      multiple: environment.customization.multipleHeader,
      showSort: false
    },
    {
      type: 'treatment',
      multiple: true,
      showSort: true
    },
    {
      type: 'footer',
      multiple: environment.customization.multipleFooter,
      showSort: false
    },
  ];

  constructor() { }

}
