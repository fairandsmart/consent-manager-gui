import {Component} from '@angular/core';
import {AddMultipleOption, SectionConfig} from '../../components/entries/entries-library/entries-library.component';
import {Icons} from '../../../../core/models/models';

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
      canAddMultiple: AddMultipleOption.ALWAYS,
      showSort: true,
      icon: Icons.theme,
      displayDescription: true
    }
  ];

  constructor() { }

}
