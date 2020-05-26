import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { mergeMap } from 'rxjs/operators';
import { ModelEntry, ModelVersion } from '../models';
import { ModelsResourceService } from '../models-resource.service';

@Component({
  selector: 'app-entry',
  templateUrl: './entry.component.html',
  styleUrls: ['./entry.component.scss']
})
export class EntryComponent implements OnInit {

  entry: ModelEntry;

  entryContent: ModelVersion;

  constructor(private activatedRoute: ActivatedRoute, private modelsResourceService: ModelsResourceService) {
  }

  ngOnInit(): void {
    this.activatedRoute.paramMap.pipe(
      mergeMap(params => this.modelsResourceService.getEntry(params.get('id')))
    ).subscribe((entry) => {
      this.entry = entry;
    });
  }

}
