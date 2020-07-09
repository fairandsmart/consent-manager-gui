import { Component } from '@angular/core';
import { SectionConfig } from '../entries/entries-library/entries-library.component';

@Component({
  selector: 'app-themes-page',
  template: `
    <app-entries-library [config]="config"></app-entries-library>
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
