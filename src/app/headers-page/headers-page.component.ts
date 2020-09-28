import { Component } from '@angular/core';
import { SectionConfig } from '../entries/entries-library/entries-library.component';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-headers-page',
  template: `
    <app-entries-library [config]="config"></app-entries-library>
  `
})
export class HeadersPageComponent {

  public config: SectionConfig[] = [
    {
      id: 'headers',
      types: ['header'],
      multiple: environment.customization.multipleHeader,
      showSort: environment.customization.multipleHeader
    }
  ];

  constructor() { }

}
