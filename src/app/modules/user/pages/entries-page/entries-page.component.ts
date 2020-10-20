import { Component, OnDestroy, OnInit } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { ModelsResourceService } from '../../../../core/http/models-resource.service';
import { SubjectsResourceService } from '../../../../core/http/subjects-resource.service';
import { KeycloakService } from 'keycloak-angular';
import { ModelEntryDto, RecordDto } from '../../../../core/models/models';
import { combineLatest, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import * as _ from 'lodash';

interface CardData {
  entry: ModelEntryDto;
  record: RecordDto;
}

@Component({
  selector: 'cm-entries-page',
  templateUrl: './entries-page.component.html',
  styleUrls: ['./entries-page.component.scss']
})
export class EntriesPageComponent implements OnInit, OnDestroy {

  public elementsKeys: string[];
  public data: CardData[] = [];
  private subs: Subscription[] = [];

  constructor(public keycloakService: KeycloakService,
              public modelsResourceService: ModelsResourceService,
              public subjectsResourceService: SubjectsResourceService) {
  }

  ngOnInit(): void {
    this.elementsKeys = environment.customization.userPageElementsOrder.split(',');
    this.subs.push(
      combineLatest([
        this.modelsResourceService.listEntriesByKeys(this.elementsKeys),
        this.subjectsResourceService.listCustomerRecords(this.keycloakService.getUsername())
      ]).pipe(
        map(([entries, records]: [ModelEntryDto[], { [key: string]: RecordDto[] }]) => {
          entries.forEach((entry) => {
            this.data.push({
              entry: entry,
              record: _.last(records[entry.key])
            });
          });
        })
      ).subscribe()
    );
  }

  ngOnDestroy(): void {
    this.subs?.forEach(s => s.unsubscribe());
  }

}
