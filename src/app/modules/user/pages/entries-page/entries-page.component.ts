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
import { Component, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { combineLatest, from, Subscription } from 'rxjs';
import { map, mergeMap, toArray } from 'rxjs/operators';
import * as _ from 'lodash';
import { ConfigService } from '../../../../core/services/config.service';
import { EntryCardComponent } from '../../components/entry/entry-card/entry-card.component';
import { AlertService } from '../../../../core/services/alert.service';
import { TranslateService } from '@ngx-translate/core';
import { listEntries, ModelDataType, ModelEntryDto } from '@fairandsmart/consent-manager/models';
import { RecordDto, RecordsMap } from '@fairandsmart/consent-manager/records';
import { listSubjectRecords } from '@fairandsmart/consent-manager/subjects';
import { CollectionPage } from '@fairandsmart/consent-manager';

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

  @ViewChildren(EntryCardComponent)
  entriesComponents: QueryList<EntryCardComponent>;
  entriesWithUnsavedChanges: EntryCardComponent[];

  public elementsKeys: string[];
  public data: CardData[] = [];
  private subs: Subscription[] = [];

  get username(): string {
    return this.keycloakService.getUsername();
  }

  constructor(public keycloakService: KeycloakService,
              public configService: ConfigService,
              public alertService: AlertService,
              public translate: TranslateService) {
  }

  ngOnInit(): void {
    this.elementsKeys = this.configService.config.userPageElements;
    this.subs.push(
      combineLatest([
        listEntries({
          keys: this.elementsKeys,
          size: -1
        }),
        listSubjectRecords(this.keycloakService.getUsername())
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

  updateUnsavedChanges(): void {
    this.entriesWithUnsavedChanges = [];
    if (this.entriesComponents) {
      this.entriesWithUnsavedChanges = this.entriesComponents
        .filter((item) => item.itemCard?.hasUnsavedChange);
    }
  }

  saveChanges(): void {
    from(this.entriesWithUnsavedChanges).pipe(
      mergeMap((item) => item.itemCard?.saveChanges()),
      toArray(),
    ).subscribe({
      next: () => {
        this.alertService.success(this.translate.instant('USER.SAVE.PREFERENCES_UPDATED'));
        this.updateUnsavedChanges();
      },
      error: (err) => {
        this.alertService.error(this.translate.instant('USER.SAVE.PREFERENCES_SAVE_ERROR'), new Error(err));
        this.updateUnsavedChanges();
      }
    });
  }

  resetChanges(): void {
    this.entriesWithUnsavedChanges.forEach((item) => item.itemCard?.resetState());
    this.updateUnsavedChanges();
  }

}
