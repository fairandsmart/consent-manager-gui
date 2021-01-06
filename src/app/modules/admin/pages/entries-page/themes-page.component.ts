import { Component } from '@angular/core';
import { SectionConfig } from '../../components/entries/entries-library/entries-library.component';
import { Icons } from '../../../../core/models/models';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'cm-themes-page',
  template: `
    <cm-entries-library [config]="config" [expandable]="false"></cm-entries-library>
  `,
  styleUrls: ['./_entries-page.scss']
})
export class ThemesPageComponent {

  public config: SectionConfig[] = [
    {
      id: 'themes',
      types: ['theme'],
      multiple: environment.customization.multipleThemes,
      showSort: environment.customization.multipleThemes,
      icon: Icons.theme,
      displayDescription: true
    }
  ];

  constructor() { }

}
