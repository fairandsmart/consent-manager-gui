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
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, mergeMap } from 'rxjs/operators';
import { ModelEntryDto, ModelVersionDto } from '../../../../../core/models/models';
import { ModelsResourceService } from '../../../../../core/http/models-resource.service';
import { of } from 'rxjs';
import * as _ from 'lodash';

@Component({
  selector: 'cm-entry-page',
  templateUrl: './model-entry-page.component.html',
  styleUrls: ['./model-entry-page.component.scss'],
  // tslint:disable-next-line:no-host-metadata-property
  host: {
    class: 'side-nav-wrapper',
  }
})
export class ModelEntryPageComponent implements OnInit {

  entry: ModelEntryDto;

  latest: ModelVersionDto<any>;

  constructor(private route: ActivatedRoute, private modelsResource: ModelsResourceService) {
  }

  ngOnInit(): void {
    this.route.paramMap.pipe(
      mergeMap((params) => this.modelsResource.getEntry(params.get('id'))),
      mergeMap((entry: ModelEntryDto) => {
        const lastVersion = _.last(entry.versions);
        if (lastVersion) {
          return this.modelsResource.getVersion(entry.id, lastVersion.id)
            .pipe(
              map((version) => ([entry, version]))
            );
        }
        return of([entry, null]);
      })
    ).subscribe(([entry, latest]: [ModelEntryDto, ModelVersionDto]) => {
      this.entry = entry;
      this.latest = latest;
    });
  }

}
