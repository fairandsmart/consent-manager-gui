import { Component } from '@angular/core';
import { SectionConfig } from '../../components/entries/entries-library/entries-library.component';

@Component({
  selector: 'cm-preferences-page',
  template: `
    <cm-entries-library [config]="config" [expandable]="false"></cm-entries-library>
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
