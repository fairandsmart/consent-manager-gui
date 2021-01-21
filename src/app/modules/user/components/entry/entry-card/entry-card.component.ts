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
import { Component, Input, OnInit } from '@angular/core';
import { ModelEntryDto, ModelVersionDto, RecordDto } from '../../../../../core/models/models';
import { ModelsResourceService } from '../../../../../core/http/models-resource.service';

@Component({
  selector: 'cm-entry-card',
  templateUrl: './entry-card.component.html',
  styleUrls: ['./entry-card.component.scss']
})
export class EntryCardComponent implements OnInit {

  @Input()
  entry: ModelEntryDto;

  active: ModelVersionDto<any>;

  @Input()
  record: RecordDto;

  constructor(public modelsResource: ModelsResourceService) {
  }

  ngOnInit(): void {
    this.modelsResource.getActiveVersion(this.entry.id)
      .subscribe((version) => this.active = version);
  }

}
