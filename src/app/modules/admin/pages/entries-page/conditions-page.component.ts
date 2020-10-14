import { Component } from '@angular/core';
import { SectionConfig } from '../../components/entries/entries-library/entries-library.component';

@Component({
  selector: 'cm-conditions-page',
  template: `
    <cm-entries-library [config]="config" [expandable]="false"></cm-entries-library>
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
