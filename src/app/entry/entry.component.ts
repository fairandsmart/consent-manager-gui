import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { catchError, mergeMap } from 'rxjs/operators';
import { ModelEntryDto, ModelVersionDto } from '../models';
import { ModelsResourceService } from '../models-resource.service';
import { of, zip } from 'rxjs';

@Component({
  selector: 'app-entry',
  templateUrl: './entry.component.html',
  styleUrls: ['./entry.component.scss'],
  // tslint:disable-next-line:no-host-metadata-property
  host: {
    class: 'side-nav-wrapper',
  }
})
export class EntryComponent implements OnInit {

  entry: ModelEntryDto;

  latest: ModelVersionDto;

  constructor(private activatedRoute: ActivatedRoute, private modelsResourceService: ModelsResourceService) {
  }

  ngOnInit(): void {
    this.activatedRoute.paramMap.pipe(
      mergeMap((params) => zip(
          this.modelsResourceService.getEntry(params.get('id')),
          this.modelsResourceService.getLatestVersion(params.get('id')).pipe(
            catchError((err) => {
              console.error(err);
              return of(null);
            })
          )
        )
      )
    ).subscribe(([entry, latest]) => {
      this.entry = entry;
      this.latest = latest;
    });
  }

}
