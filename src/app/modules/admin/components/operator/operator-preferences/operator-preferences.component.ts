import { Component, OnInit } from '@angular/core';
import { OperatorConsentListDirective } from '../operator-consent-list/operator-consent-list.directive';
import { ModelsResourceService } from '../../../../../core/http/models-resource.service';
import { SubjectsResourceService } from '../../../../../core/http/subjects-resource.service';
import { Icons } from '../../../../../core/models/models';

@Component({
  selector: 'cm-operator-preferences',
  templateUrl: './operator-preferences.component.html',
  styleUrls: ['./operator-preferences.component.scss']
})
export class OperatorPreferencesComponent extends OperatorConsentListDirective implements OnInit {

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
    this.type = 'preference';
    super.ngOnInit();
  }

  action(v): void {
    this.operatorAction.emit(v);
  }

}
