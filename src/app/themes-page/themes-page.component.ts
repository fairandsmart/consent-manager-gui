import { Component } from '@angular/core';
import { SectionConfig } from '../entries/entries.component';

@Component({
  selector: 'app-themes-page',
  template: `
    <app-entries [config]="config"></app-entries>
  `
})
export class ThemesPageComponent {

  public config: SectionConfig[] = [
    {
      type: 'theme',
      multiple: true,
      showSort: true
    }
  ];

  constructor() { }

}
