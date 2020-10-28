import { Component } from '@angular/core';
import { SectionConfig } from '../../components/entries/entries-library/entries-library.component';
import { Icons } from '../../../../core/models/models';

@Component({
  selector: 'cm-treatments-page',
  template: `
    <cm-entries-library [config]="config" [expandable]="false"></cm-entries-library>
  `
})
export class TreatmentsPageComponent {

  public config: SectionConfig[] = [
    {
      id: 'treatments',
      types: ['treatment'],
      multiple: true,
      showSort: true,
      icon: Icons.treatment,
      displayDescription: true
    }
  ];

  constructor() { }

}
