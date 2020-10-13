import { Component } from '@angular/core';
import { SectionConfig } from '../../components/entries/entries-library/entries-library.component';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-basicinfo-page',
  template: `
    <app-entries-library [config]="config" [expandable]="false"></app-entries-library>
  `
})
export class BasicinfoPageComponent {

  public config: SectionConfig[] = [
    {
      id: 'infos',
      types: ['basicinfo'],
      multiple: environment.customization.multipleInfo,
      showSort: environment.customization.multipleInfo
    }
  ];

  constructor() { }

}
