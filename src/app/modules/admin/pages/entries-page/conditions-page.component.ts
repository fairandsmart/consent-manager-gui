import { Component } from '@angular/core';
import { SectionConfig } from '../../components/entries/entries-library/entries-library.component';

@Component({
  selector: 'app-conditions-page',
  template: `
    <app-entries-library [config]="config" [expandable]="false"></app-entries-library>
  `
})
export class ConditionsPageComponent {

  public config: SectionConfig[] = [
    {
      id: 'conditions',
      types: ['conditions'],
      multiple: true,
      showSort: true
    }
  ];

  constructor() { }

}
