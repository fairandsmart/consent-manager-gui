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
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { catchError, filter, first, skip, takeUntil, tap } from 'rxjs/operators';
import { CollectionPage } from '@fairandsmart/consents-ce';

export abstract class CollectionDatasource<T, F> implements DataSource<T> {

  private valuesSubject = new BehaviorSubject<T[]>(null);
  private responseSubject = new BehaviorSubject<CollectionPage<T>>(null);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  public loading$ = this.loadingSubject.asObservable();
  public response$ = this.responseSubject.asObservable();

  // tslint:disable-next-line:variable-name
  private _paginator: MatPaginator;

  get paginator(): MatPaginator | null {
    return this._paginator;
  }

  set paginator(paginator: MatPaginator | null) {
    this._paginator = paginator;
    if (paginator != null) {
      this.responseSubject.asObservable().pipe(
        first(),
        tap((response) => {
          if (response != null) {
            this._paginator.length = response.totalCount;
            this._paginator.pageSize = response.pageSize;
          }
        })
      ).subscribe();
    }
  }

  connect(collectionViewer?: CollectionViewer): Observable<T[] | ReadonlyArray<T>> {
    return this.valuesSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.valuesSubject.complete();
    this.loadingSubject.complete();
  }

  protected abstract getPage(pageFilter: F): Observable<CollectionPage<T>>;

  loadPage(pageFilter: F): void {
    this.loadingSubject.next(true);
    this.getPage(pageFilter).pipe(
      takeUntil(this.loading$.pipe(
        skip(1),
        // Aborts request if loadPage() called up again before completion of previous
        filter(loading => loading),
      )),
      catchError(err => {
        console.error(err);
        return of({values: [], totalCount: 0} as CollectionPage<T>);
      })
    ).subscribe(response => {
      this.loadingSubject.next(false);
      this.responseSubject.next(response);
      if (this._paginator != null) {
        this._paginator.length = response.totalCount;
        this._paginator.pageSize = response.pageSize;
      }
      this.valuesSubject.next(response.values);
    });
  }

}
