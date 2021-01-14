import { Component, OnInit } from '@angular/core';
import { OperatorConsentListDirective } from '../operator-consent-list/operator-consent-list.directive';
import { ModelsResourceService } from '../../../../../core/http/models-resource.service';
import { SubjectsResourceService } from '../../../../../core/http/subjects-resource.service';
import { Icons, RecordStatus } from '../../../../../core/models/models';

@Component({
  selector: 'cm-operator-conditions',
  templateUrl: './operator-conditions.component.html',
  styleUrls: ['../operator-consent-list/_operator-consent-list.directive.scss', './operator-conditions.component.scss']
})
export class OperatorConditionsComponent extends OperatorConsentListDirective implements OnInit {

  readonly ICONS = Icons;
  public displayedColumns = [
    'key', 'name', 'version', 'recordCreation', 'status'
  ];
  public pageSizeOptions = [10, 25, 50];

  constructor(
    protected modelsResource: ModelsResourceService,
    protected subjectsResource: SubjectsResourceService
  ) {
    super(modelsResource, subjectsResource);
  }

  ngOnInit(): void {
    this.type = 'conditions';
    super.ngOnInit();
  }

  getVersion(element): string {
    if (element.versionIndex) {
      return 'v' + element.versionIndex;
    } else {
      return '-';
    }
  }

  getRecordStatus(element): string {
    return element.status === RecordStatus.VALID && element.value === 'accepted' ? 'VALID' : 'INVALID';
  }

}
