import { Component } from '@angular/core';
import { SectionConfig } from '../../components/entries/entries-library/entries-library.component';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'cm-basicinfo-page',
  template: `
    <cm-entries-library [config]="config" [expandable]="false"></cm-entries-library>
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
