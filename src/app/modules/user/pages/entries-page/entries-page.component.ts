import { Component, OnDestroy, OnInit } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { ModelsResourceService } from '../../../../core/http/models-resource.service';
import { SubjectsResourceService } from '../../../../core/http/subjects-resource.service';
import { KeycloakService } from 'keycloak-angular';
import { CollectionPage, ModelDataType, ModelEntryDto, RecordDto, RecordsMap } from '../../../../core/models/models';
import { combineLatest, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import * as _ from 'lodash';
import { ConfigService } from '../../../../core/services/config.service';

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

  get username(): string {
    return this.keycloakService.getUsername();
  }

  constructor(public keycloakService: KeycloakService,
              public modelsResourceService: ModelsResourceService,
              public subjectsResourceService: SubjectsResourceService,
              public configService: ConfigService) {
  }

  ngOnInit(): void {
    this.elementsKeys = this.configService.config.userPageElements;
    this.subs.push(
      combineLatest([
        this.modelsResourceService.listEntries({
          keys: this.elementsKeys,
          size: -1
        }),
        this.subjectsResourceService.listCustomerRecords(this.keycloakService.getUsername())
      ]).pipe(
        map(([entries, records]: [CollectionPage<ModelEntryDto>, RecordsMap]) => {
          this.elementsKeys.forEach((key) => {
            this.data.push({
              entry: entries.values.find(entry => entry.key === key),
              record: _.last(records[key])
            });
          });
        })
      ).subscribe()
    );
  }

  ngOnDestroy(): void {
    this.subs?.forEach(s => s.unsubscribe());
  }

  filterCards(cards: CardData[], category: ModelDataType): CardData[] {
    return cards.filter((card) => card.entry?.type === category);
  }

}
