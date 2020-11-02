import { Component, OnInit } from '@angular/core';
import { OperatorConsentListDirective } from '../operator-consent-list/operator-consent-list.directive';
import { ModelsResourceService } from '../../../../../core/http/models-resource.service';
import { SubjectsResourceService } from '../../../../../core/http/subjects-resource.service';
import { Icons, Preference } from '../../../../../core/models/models';
import {
  SubjectRecordEditorDialogComponent,
  SubjectRecordEditorDialogData
} from '../subject-record-editor-dialog/subject-record-editor-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'cm-operator-preferences',
  templateUrl: './operator-preferences.component.html',
  styleUrls: ['./operator-preferences.component.scss']
})
export class OperatorPreferencesComponent extends OperatorConsentListDirective implements OnInit {

  readonly ICONS = Icons;
  public displayedColumns = ['key', 'name', 'value', 'actions', 'recordCreation'];
  public pageSizeOptions = [10, 25, 50];

  constructor(
    protected modelsResource: ModelsResourceService,
    protected subjectsResource: SubjectsResourceService,
    private dialog: MatDialog,
    private translate: TranslateService
  ) {
    super(modelsResource, subjectsResource);
  }

  ngOnInit(): void {
    this.type = 'preference';
    super.ngOnInit();
  }

  action(element): void {
    this.modelsResource.getActiveVersion(element.id).subscribe((version) => {
      const versionDto: Preference = version.data[this.translate.currentLang] as Preference;
      this.dialog.open<SubjectRecordEditorDialogComponent, SubjectRecordEditorDialogData>(SubjectRecordEditorDialogComponent, {
        data: {
          record: element,
          valueType: versionDto.valueType,
          options: versionDto.options
        }
      }).afterClosed().subscribe((result) => {
        this.operatorAction.emit(result);
      });
    });
  }

  formatValue(value): string {
    return value !== undefined ? value.split(',').join(' ; ') : '-';
  }

}
