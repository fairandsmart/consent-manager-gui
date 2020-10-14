import { Component } from '@angular/core';
import { SectionConfig } from '../../components/entries/entries-library/entries-library.component';

@Component({
  selector: 'cm-themes-page',
  template: `
    <cm-entries-library [config]="config" [expandable]="false"></cm-entries-library>
  `
})
export class ThemesPageComponent {

  public config: SectionConfig[] = [
    {
      id: 'themes',
      types: ['theme'],
      multiple: true,
      showSort: true
    }
  ];

  constructor() { }

}
