import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, mergeMap } from 'rxjs/operators';
import { ModelEntryDto, ModelVersionDto } from '../../../../core/models/models';
import { ModelsResourceService } from '../../../../core/http/models-resource.service';
import { of } from 'rxjs';
import * as _ from 'lodash';

@Component({
  selector: 'app-entry-page',
  templateUrl: './entry-page.component.html',
  styleUrls: ['./entry-page.component.scss'],
  // tslint:disable-next-line:no-host-metadata-property
  host: {
    class: 'side-nav-wrapper',
  }
})
export class EntryPageComponent implements OnInit {

  entry: ModelEntryDto;

  latest: ModelVersionDto;

  constructor(private route: ActivatedRoute, private modelsResourceService: ModelsResourceService) {
  }

  ngOnInit(): void {
    this.route.paramMap.pipe(
      mergeMap((params) => this.modelsResourceService.getEntry(params.get('id'))),
      mergeMap((entry: ModelEntryDto) => {
        const lastVersion = _.last(entry.versions);
        if (lastVersion) {
          return this.modelsResourceService.getVersion(entry.id, lastVersion.id)
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
