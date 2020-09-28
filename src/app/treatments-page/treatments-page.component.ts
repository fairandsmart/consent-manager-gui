import { Component } from '@angular/core';
import { SectionConfig } from '../entries/entries-library/entries-library.component';

@Component({
  selector: 'app-treatments-page',
  template: `
    <app-entries-library [config]="config"></app-entries-library>
  `
})
export class TreatmentsPageComponent {

  public config: SectionConfig[] = [
    {
      id: 'treatments',
      types: ['treatment'],
      multiple: true,
      showSort: true
    }
  ];

  constructor() { }

}
