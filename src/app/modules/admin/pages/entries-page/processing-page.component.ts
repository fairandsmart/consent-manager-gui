import {Component} from '@angular/core';
import {AddMultipleOption, SectionConfig} from '../../components/entries/entries-library/entries-library.component';
import {Icons} from '../../../../core/models/models';

@Component({
  selector: 'cm-processing-page',
  template: `
    <cm-entries-library [config]="config" [expandable]="false"></cm-entries-library>
  `,
  styleUrls: ['./_entries-page.scss']
})
export class ProcessingPageComponent {

  public config: SectionConfig[] = [
    {
      id: 'processing',
      types: ['processing'],
      canAddMultiple: AddMultipleOption.ALWAYS,
      showSort: true,
      icon: Icons.processing,
      displayDescription: true
    }
  ];

  constructor() { }

}
