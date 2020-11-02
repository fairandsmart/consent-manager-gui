import { Component, OnInit } from '@angular/core';
import { ModelsResourceService } from '../../../../../core/http/models-resource.service';
import { SubjectsResourceService } from '../../../../../core/http/subjects-resource.service';
import { OperatorConsentListDirective } from '../operator-consent-list/operator-consent-list.directive';
import { EntryRecord, Icons } from '../../../../../core/models/models';
import {
  SubjectRecordEditorDialogComponent,
  SubjectRecordEditorDialogData
} from '../subject-record-editor-dialog/subject-record-editor-dialog.component';
import { MatDialog } from '@angular/material/dialog';

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
    console.log('history ' + element.key);
  }

}
