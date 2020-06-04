import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { CollectionPage } from '../models';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { catchError, filter, skip, takeUntil } from 'rxjs/operators';

export abstract class CollectionDatasource<T, F> implements DataSource<T> {

  private valuesSubject = new BehaviorSubject<T[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  public loading$ = this.loadingSubject.asObservable();

  private _paginator: MatPaginator;

  get paginator(): MatPaginator | null {
    return this._paginator;
  }

  set paginator(paginator: MatPaginator | null) {
    this._paginator = paginator;
  }

  connect(collectionViewer: CollectionViewer): Observable<T[] | ReadonlyArray<T>> {
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
        filter(loading => loading)
      )),
      catchError(err => {
        console.error(err);
        return of({values: [], totalCount: 0});
      })
    ).subscribe(response => {
      this.loadingSubject.next(false);
      if (this._paginator != null) {
        this._paginator.length = response.totalCount;
      }
      this.valuesSubject.next(response.values);
    });
  }

}
