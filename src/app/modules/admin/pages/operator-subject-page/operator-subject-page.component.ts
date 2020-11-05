import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  CollectionMethod,
  ConsentContext,
  ConsentFormOrientation,
  ConsentFormType,
  OperatorLogElement,
  RecordsMap
} from '../../../../core/models/models';
import {
  SubjectRecordApplyChangesDialogComponent,
  SubjectRecordApplyChangesDialogData
} from '../../components/operator/subject-record-apply-changes-dialog/subject-record-apply-changes-dialog.component';
import { HttpParams } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ConsentsResourceService } from '../../../../core/http/consents-resource.service';
import { OperatorProcessingComponent } from '../../components/operator/operator-processing/operator-processing.component';
import { OperatorPreferencesComponent } from '../../components/operator/operator-preferences/operator-preferences.component';
import { OperatorConditionsComponent } from '../../components/operator/operator-conditions/operator-conditions.component';
import { SubjectsResourceService } from '../../../../core/http/subjects-resource.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'cm-operator-subject-page',
  templateUrl: './operator-subject-page.component.html',
  styleUrls: ['./operator-subject-page.component.scss']
})
export class OperatorSubjectPageComponent implements OnInit {

  private readonly defaultLocale = environment.customization.defaultLocale;

  public subject: string;
  public records: RecordsMap;
  public operatorLog: OperatorLogElement[] = [];

  @ViewChild('processing')
  processingComponent: OperatorProcessingComponent;

  @ViewChild('preferences')
  preferencesComponent: OperatorPreferencesComponent;

  @ViewChild('conditions')
  conditionsComponent: OperatorConditionsComponent;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private translate: TranslateService,
    private consentsResource: ConsentsResourceService,
    private subjectsResource: SubjectsResourceService) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.subject = params.get('subject');
      this.reloadRecords();
    });
    this.reloadRecords();
  }

  addElementToLog(element): void {
    if (element) {
      const previous = this.operatorLog.find(e => e.identifier === element.identifier);
      if (previous) {
        this.operatorLog[this.operatorLog.indexOf(previous)] = element;
      } else {
        this.operatorLog.push(element);
      }
    }
  }

  removeElementFromLog(index): void {
    this.operatorLog.splice(index, 1);
  }

  formatPreferenceValue(value): string {
    return value !== undefined ? value.split(',').join(' ; ') : '-';
  }

  reloadRecords(): void {
    this.subjectsResource.listCustomerRecords(this.subject).subscribe((records) => {
      this.records = records;
      this.processingComponent.updateRecords(records);
      this.preferencesComponent.updateRecords(records);
      this.conditionsComponent.updateRecords(records);
    });
  }

  submitLog(): void {
    this.dialog.open<SubjectRecordApplyChangesDialogComponent, SubjectRecordApplyChangesDialogData>(
      SubjectRecordApplyChangesDialogComponent,
      {data: {recipient: '', model: '', comment: ''}})
      .afterClosed().subscribe((result) => {
      if (result) {
        const ctx: ConsentContext = {
          subject: this.subject,
          orientation: ConsentFormOrientation.VERTICAL,
          info: '',
          elements: this.operatorLog.map(e => e.identifier),
          callback: '',
          locale: this.defaultLocale,
          formType: ConsentFormType.FULL,
          receiptDeliveryType: 'DOWNLOAD',
          userinfos: {},
          attributes: {},
          notificationModel: result.model,
          notificationRecipient: result.recipient,
          collectionMethod: CollectionMethod.OPERATOR,
          author: '',
          preview: false,
          iframe: true
        };

        this.consentsResource.generateToken(ctx).subscribe((token) => {
          let values: HttpParams = new HttpParams().append('token', token).append('comment', result.comment);
          this.operatorLog.forEach(element => values = values.append(element.identifier, element.value));

          this.consentsResource.postConsent(values).subscribe((receipt) => {
            this.operatorLog = [];
            this.reloadRecords();
          });
        });
      }
    });
  }

}