import { Component, OnInit } from '@angular/core';
import { ModelsResourceService } from '../../../../../core/http/models-resource.service';
import { SubjectsResourceService } from '../../../../../core/http/subjects-resource.service';
import { OperatorConsentListDirective } from '../operator-consent-list/operator-consent-list.directive';
import { EntryRecord, Icons, RecordStatus } from '../../../../../core/models/models';
import {
  SubjectRecordEditorDialogComponent,
  SubjectRecordEditorDialogData
} from '../subject-record-editor-dialog/subject-record-editor-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { SubjectRecordsHistoryComponent } from '../subject-records-history/subject-records-history.component';

@Component({
  selector: 'cm-operator-processing',
  templateUrl: './operator-processing.component.html',
  styleUrls: ['../operator-consent-list/_operator-consent-list.directive.scss', './operator-processing.component.scss']
})
export class OperatorProcessingComponent extends OperatorConsentListDirective implements OnInit {

  readonly ICONS = Icons;
  public displayedColumns = [
    'key', 'name', 'collectionMethod', 'recordExpiration', 'history', 'status', 'actions'
  ];
  public pageSizeOptions = [10, 25, 50];

  constructor(
    protected modelsResource: ModelsResourceService,
    protected subjectsResource: SubjectsResourceService,
    private dialog: MatDialog
  ) {
    super(modelsResource, subjectsResource);
  }

  ngOnInit(): void {
    this.type = 'processing';
    super.ngOnInit();
  }

  action(element: EntryRecord): void {
    this.dialog.open<SubjectRecordEditorDialogComponent, SubjectRecordEditorDialogData>(SubjectRecordEditorDialogComponent, {
      data: {
        record: element,
        options: ['refused', 'accepted']
      }
    }).afterClosed().subscribe((result) => {
      this.operatorAction.emit(result);
    });
  }

  showHistory(element): void {
    this.dialog.open<SubjectRecordsHistoryComponent>(SubjectRecordsHistoryComponent, {
      data: this.records[element.key]?.slice().reverse()
    });
  }

  getRecordStatus(element): string {
    return element.status === RecordStatus.VALID && element.value === 'accepted' ? 'VALID' : 'INVALID';
  }

}
