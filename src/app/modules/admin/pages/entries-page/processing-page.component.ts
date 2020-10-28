import { Component } from '@angular/core';
import { SectionConfig } from '../../components/entries/entries-library/entries-library.component';

@Component({
  selector: 'cm-processings-page',
  template: `
    <cm-entries-library [config]="config" [expandable]="false"></cm-entries-library>
  `
})
export class ProcessingPageComponent {

  public config: SectionConfig[] = [
    {
      id: 'processing',
      types: ['processing'],
      multiple: true,
      showSort: true
    }
  ];

  constructor() { }

}
