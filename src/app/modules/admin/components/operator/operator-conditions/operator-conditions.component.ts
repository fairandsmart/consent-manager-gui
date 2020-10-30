import { Component, OnInit } from '@angular/core';
import { OperatorConsentListDirective } from '../operator-consent-list/operator-consent-list.directive';
import { ModelsResourceService } from '../../../../../core/http/models-resource.service';
import { SubjectsResourceService } from '../../../../../core/http/subjects-resource.service';
import { Icons, ModelVersionStatus } from '../../../../../core/models/models';

@Component({
  selector: 'cm-operator-conditions',
  templateUrl: './operator-conditions.component.html',
  styleUrls: ['./operator-conditions.component.scss']
})
export class OperatorConditionsComponent extends OperatorConsentListDirective implements OnInit {

  readonly ICONS = Icons;
  public displayedColumns = [
    'key', 'name', 'subtype', 'version', 'recordCreation', 'status'
  ]; // TODO : le mockup parle d'un sous-type 'CGU', 'CGS', etc, qui n'est pas implémenté
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
    if (element.status === ModelVersionStatus.ACTIVE && element.value === 'accepted') {
      return 'TODO: feu vert';
    } else {
      return 'TODO: feu rouge';
    }
  }

}
