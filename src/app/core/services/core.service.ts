import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { listEntries, ModelEntryHelper } from '@fairandsmart/consent-manager/models';

@Injectable({
  providedIn: 'root'
})
export class CoreService {
  hasActiveInfo$: Subject<boolean>;
  hasActiveInfo: boolean;

  constructor() {
    this.initWatchers();
  }

  initWatchers(): void {
    this.hasActiveInfo$ = new Subject<boolean>();
    this.hasActiveInfo$.subscribe((current) => this.hasActiveInfo = current);
  }

  checkInfo(): void {
    listEntries({types: ['information'], size: -1}).pipe(
      map((res) => res.values.some((info) => ModelEntryHelper.hasActiveVersion(info))),
    ).subscribe((hasActiveInfo) => this.hasActiveInfo$.next(hasActiveInfo));
  }
}
