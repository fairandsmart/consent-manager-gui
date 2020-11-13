import { Component } from '@angular/core';
import { SectionConfig } from '../../components/entries/entries-library/entries-library.component';
import { environment } from '../../../../../environments/environment';
import { Icons } from '../../../../core/models/models';

@Component({
  selector: 'cm-basicinfo-page',
  template: `
    <cm-entries-library [config]="config" [expandable]="false"></cm-entries-library>
  `,
  styleUrls: ['./_entries-page.scss']
})
export class BasicinfoPageComponent {

  public config: SectionConfig[] = [
    {
      id: 'infos',
      types: ['basicinfo'],
      multiple: environment.customization.multipleInfo,
      showSort: environment.customization.multipleInfo,
      icon: Icons.basicinfo,
      displayDescription: true
    }
  ];

  constructor() { }

}
