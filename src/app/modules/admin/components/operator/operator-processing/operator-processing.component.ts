import { Component, OnInit } from '@angular/core';
import { ModelsResourceService } from '../../../../../core/http/models-resource.service';
import { SubjectsResourceService } from '../../../../../core/http/subjects-resource.service';
import { OperatorConsentListDirective } from '../operator-consent-list/operator-consent-list.directive';
import { Icons } from '../../../../../core/models/models';

@Component({
  selector: 'cm-operator-processing',
  templateUrl: './operator-processing.component.html',
  styleUrls: ['./operator-processing.component.scss']
})
export class OperatorProcessingComponent extends OperatorConsentListDirective implements OnInit {

  readonly ICONS = Icons;
  public displayedColumns = [
    'key', 'name', 'type', 'value', 'collectionMethod', 'comment', 'status', 'recordCreation', 'recordExpiration', 'actions'
  ];
  public pageSizeOptions = [10, 25, 50];

  constructor(
    protected modelsResource: ModelsResourceService,
    protected subjectsResource: SubjectsResourceService
  ) {
    super(modelsResource, subjectsResource);
  }

  ngOnInit(): void {
    this.type = 'processing';
    super.ngOnInit();
  }

  action(v): void {
    this.operatorAction.emit(v);
  }

}
