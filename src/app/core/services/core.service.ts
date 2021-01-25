import { Injectable } from '@angular/core';
import { ModelsResourceService } from '../http/models-resource.service';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { hasActiveVersion } from '../utils/model-entry.utils';

@Injectable({
  providedIn: 'root'
})
export class CoreService {
  hasActiveBasicInfo$: Subject<boolean>;
  hasActiveBasicInfo: boolean;

  constructor(
    private modelsResourceService: ModelsResourceService
  ) {
    this.initWatchers();
  }

  initWatchers(): void {
    this.hasActiveBasicInfo$ = new Subject<boolean>();
    this.hasActiveBasicInfo$.subscribe((current) => this.hasActiveBasicInfo = current);
  }

  checkBasicInfo() {
    this.modelsResourceService.listEntries({types: ['basicinfo'], size: -1}).pipe(
      map((res) => res.values.some((info) => hasActiveVersion(info))),
    ).subscribe((hasActiveBasicInfo) => this.hasActiveBasicInfo$.next(hasActiveBasicInfo));
  }
}
