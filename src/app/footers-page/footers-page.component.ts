import { Component } from '@angular/core';
import { SectionConfig } from '../entries/entries-library/entries-library.component';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-footers-page',
  template: `
    <app-entries-library [config]="config"></app-entries-library>
  `
})
export class FootersPageComponent {

  public config: SectionConfig[] = [
    {
      id: 'footers',
      types: ['footer'],
      multiple: environment.customization.multipleFooter,
      showSort: environment.customization.multipleFooter
    }
  ];

  constructor() { }

}
