import { Component, Input, OnInit } from '@angular/core';
import { ModelEntryDto, ModelVersionDto, RecordDto } from '../../../../../core/models/models';
import { ModelsResourceService } from '../../../../../core/http/models-resource.service';

@Component({
  selector: 'cm-entry-card',
  templateUrl: './entry-card.component.html',
  styleUrls: ['./entry-card.component.scss']
})
export class EntryCardComponent implements OnInit {

  @Input()
  entry: ModelEntryDto;

  active: ModelVersionDto<any>;

  @Input()
  record: RecordDto;

  constructor(public modelsResourceService: ModelsResourceService) {
  }

  ngOnInit(): void {
    this.modelsResourceService.getActiveVersion(this.entry.id)
      .subscribe((version) => this.active = version);
  }

}
