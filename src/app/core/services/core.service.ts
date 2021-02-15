import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { listEntries, ModelEntryHelper } from '@fairandsmart/consent-manager/models';

@Injectable({
  providedIn: 'root'
})
export class CoreService {
  hasActiveBasicInfo$: Subject<boolean>;
  hasActiveBasicInfo: boolean;

  constructor() {
    this.initWatchers();
  }

  initWatchers(): void {
    this.hasActiveBasicInfo$ = new Subject<boolean>();
    this.hasActiveBasicInfo$.subscribe((current) => this.hasActiveBasicInfo = current);
  }

  checkBasicInfo(): void {
    listEntries({types: ['basicinfo'], size: -1}).pipe(
      map((res) => res.values.some((info) => ModelEntryHelper.hasActiveVersion(info))),
    ).subscribe((hasActiveBasicInfo) => this.hasActiveBasicInfo$.next(hasActiveBasicInfo));
  }
}
