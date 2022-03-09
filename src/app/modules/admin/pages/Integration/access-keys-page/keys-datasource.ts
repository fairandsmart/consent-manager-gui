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
import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import { Key, listKeys } from '@fairandsmart/consents-ce/keys';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {catchError, filter, skip, takeUntil} from 'rxjs/operators';

export class KeysDataSource implements DataSource<Key> {

  private valuesSubject = new BehaviorSubject<Key[]>(null);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  public loading$ = this.loadingSubject.asObservable();

  constructor() {
  }

  connect(collectionViewer: CollectionViewer): Observable<Key[] | ReadonlyArray<Key>> {
    return this.valuesSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.valuesSubject.complete();
    this.loadingSubject.complete();
  }

  load(): void {
    this.loadingSubject.next(true);
    listKeys().pipe(
      takeUntil(this.loading$.pipe(
        skip(1),
        // Aborts request if loadPage() called up again before completion of previous
        filter(loading => loading),
      )),
      catchError(err => {
        console.error(err);
        return of([] as Key[]);
      })
    ).subscribe(response => {
      this.loadingSubject.next(false);
      this.valuesSubject.next(response);
    });
  }

}
