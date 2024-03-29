/*-
 * #%L
 * Right Consents, a Universal Consents & Preferences Management Platform.
 * %%
 * Copyright (C) 2020 - 2021 Fair And Smart
 * %%
 * This file is part of Right Consents Community Edition.
 *
 * Right Consents Community Edition is published by FAIR AND SMART under the
 * GNU GENERAL PUBLIC LICENCE Version 3 (GPLv3) and a set of additional terms.
 *
 * For more information, please see the “LICENSE” and “LICENSE.FAIRANDSMART”
 * files, or see https://www.fairandsmart.com/opensource/.
 * #L%
 */
import { Component } from '@angular/core';
import { AddMultipleOption, SectionConfig } from '../../../components/entries/entries-library/entries-library.component';
import { environment } from '../../../../../../environments/environment';
import { Icons } from '../../../../../core/models/common';

@Component({
  selector: 'cm-information-page',
  template: `
    <cm-entries-library [config]="config" [expandable]="false"></cm-entries-library>
  `,
  styleUrls: ['./_entries-page.scss']
})
export class InformationPageComponent {

  public config: SectionConfig[] = [
    {
      id: 'infos',
      types: ['information'],
      canAddMultiple: environment.customization.multipleInfo,
      showActions: environment.customization.multipleInfo === AddMultipleOption.ALWAYS,
      icon: Icons.information,
      fullSize: true,
      persistFilters: true
    }
  ];

  constructor() { }

}
