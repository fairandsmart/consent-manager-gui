import { Component } from '@angular/core';
import { SectionConfig } from '../entries/entries-library/entries-library.component';

@Component({
  selector: 'app-preferences-page',
  template: `
    <app-entries-library [config]="config"></app-entries-library>
  `
})
export class PreferencesPageComponent {

  public config: SectionConfig[] = [
    {
      id: 'preferences',
      types: ['preference'],
      multiple: true,
      showSort: true
    }
  ];

  constructor() { }

}
