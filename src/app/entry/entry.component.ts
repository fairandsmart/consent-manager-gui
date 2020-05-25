import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { mergeMap } from 'rxjs/operators';
import { ConsentElementVersion, ConsentsResourceService } from '../consents-resource.service';

@Component({
  selector: 'app-entry',
  templateUrl: './entry.component.html',
  styleUrls: ['./entry.component.scss']
})
export class EntryComponent implements OnInit {

  entryContent: ConsentElementVersion;

  constructor(private activatedRoute: ActivatedRoute, private consentsResource: ConsentsResourceService) {
  }

  ngOnInit(): void {
    this.activatedRoute.paramMap.pipe(
      mergeMap(params => this.consentsResource.getEntryContent(params.get('id')))
    ).subscribe((entryContent) => {
      this.entryContent = entryContent;
    });
  }

}
