import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {Key} from '../../../../../core/models/models';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {KeysResourceService} from '../../../../../core/http/keys-resource.service';
import {catchError, filter, skip, takeUntil} from 'rxjs/operators';

export class KeysDataSource implements DataSource<Key> {

  private valuesSubject = new BehaviorSubject<Key[]>(null);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  public loading$ = this.loadingSubject.asObservable();

  constructor(private keysResource: KeysResourceService) {
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
    this.keysResource.listKeys().pipe(
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
