import { Component, OnInit } from '@angular/core';
import { ModelsResourceService } from '../../../../../core/http/models-resource.service';
import { SubjectsResourceService } from '../../../../../core/http/subjects-resource.service';
import { OperatorConsentListDirective } from '../operator-consent-list/operator-consent-list.directive';
import { Icons, ModelVersionStatus } from '../../../../../core/models/models';

@Component({
  selector: 'cm-operator-processing',
  templateUrl: './operator-processing.component.html',
  styleUrls: ['./operator-processing.component.scss']
})
export class OperatorProcessingComponent extends OperatorConsentListDirective implements OnInit {

  readonly ICONS = Icons;
  public displayedColumns = [
    'key', 'name', 'collectionMethod', 'recordExpiration', 'history', 'status', 'actions'
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

  action(value, element): void {
    console.log('value', value);
    this.operatorAction.emit(element);
  }

  showHistory(element): void {
    console.log('history ' + element.key);
  }

  getRecordStatus(element): string {
    if (element.status === ModelVersionStatus.ACTIVE && element.value === 'accepted') {
      return 'TODO: feu vert';
    } else {
      return 'TODO: feu rouge';
    }
  }

}
