import { Component, Input, OnInit } from '@angular/core';
import { ModelData, ModelEntryDto, ModelVersionDto } from '../../../../../core/models/models';
import { ModelsResourceService } from '../../../../../core/http/models-resource.service';
import * as _ from 'lodash';
import { map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'cm-entry-card',
  templateUrl: './entry-card.component.html',
  styleUrls: ['./entry-card.component.scss']
})
export class EntryCardComponent<T extends ModelData> implements OnInit {

  @Input()
  key: string;

  entry: ModelEntryDto;

  latest: ModelVersionDto<T>;

  constructor(public modelsResourceService: ModelsResourceService) { }

  ngOnInit(): void {
    this.modelsResourceService.getEntry(this.key).pipe(
      mergeMap((entry) => {
        const lastVersion = _.last(entry.versions);
        if (lastVersion) {
          return this.modelsResourceService.getVersion(entry.id, lastVersion.id)
            .pipe(
              map((version) => ([entry, version]))
            );
        }
        return of([entry, null]);
      })
    ).subscribe(([entry, latest]: [ModelEntryDto, ModelVersionDto<T>]) => {
      this.entry = entry;
      this.latest = latest;
    });
  }

}
