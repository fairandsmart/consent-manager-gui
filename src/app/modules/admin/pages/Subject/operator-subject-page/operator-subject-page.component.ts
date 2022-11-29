/*-
 * #%L
 * Right Consents, a Universal Consents & Preferences Management Platform.
 * %%
 * Copyright (C) 2020 - 2021 Fair And Smart
 * %%
 * This file is part of Right Consents Community Edition.
 *
 * Right Consents Community Edition is published by FAIR AND SMART under the
 * GNU GENERAL PUBLIC LICENCE Version 3 (GPLv3) and a set of additional terms.
 *
 * For more information, please see the “LICENSE” and “LICENSE.FAIRANDSMART”
 * files, or see https://www.fairandsmart.com/opensource/.
 * #L%
 */
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  SubjectRecordApplyChangesDialogComponent,
  SubjectRecordApplyChangesDialogDataOutput
} from '../../../components/operator/subject-record-apply-changes-dialog/subject-record-apply-changes-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { OperatorProcessingComponent } from '../../../components/operator/operator-processing/operator-processing.component';
import { OperatorPreferencesComponent } from '../../../components/operator/operator-preferences/operator-preferences.component';
import { OperatorConditionsComponent } from '../../../components/operator/operator-conditions/operator-conditions.component';
import { mergeMap } from 'rxjs/operators';
import { SubjectInfosEditorDialogComponent } from '../../../components/operator/subject-infos-editor-dialog/subject-infos-editor-dialog.component';
import { ConfigService } from '../../../../../core/services/config.service';
import {
  createSubject,
  getSubject,
  listSubjectRecords,
  SubjectDto,
  updateSubject
} from '@fairandsmart/consents-ce/subjects';
import { OperatorLogElement, RecordsMap } from '@fairandsmart/consents-ce/records';
import {
  Confirmation,
  ConsentContext,
  ConsentTransaction,
  createTransactionJson,
  postSubmissionValuesJson,
  SubjectInfosKeys
} from '@fairandsmart/consents-ce/consents';
import {
  ConsentOrigin,
  DefaultInfoTag,
  FormLayoutOrientation,
  listEntries
} from '@fairandsmart/consents-ce/models';

@Component({
  selector: 'cm-operator-subject-page',
  templateUrl: './operator-subject-page.component.html',
  styleUrls: ['./operator-subject-page.component.scss']
})
export class OperatorSubjectPageComponent implements OnInit {

  private readonly defaultLanguage;

  private subjectName: string;
  public subject: SubjectDto;
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
    private configService: ConfigService
  ) {
    this.defaultLanguage = this.configService.getDefaultLanguage();
  }

  ngOnInit(): void {
    this.route.paramMap.pipe(
      mergeMap((params) => {
        this.subjectName = params.get('subject');
        return getSubject(this.subjectName);
      }),
    ).subscribe((subject) => {
      this.subject = subject;
      this.records = {};
      this.operatorLog = [];
      this.reloadRecords();
    }, () => {
      this.subject = {
        id: null,
        name: this.subjectName,
        creationTimestamp: 0,
        emailAddress: null,
        defaultLanguage: null
      };
      this.records = {};
      this.operatorLog = [];
      this.reloadRecords();
    });
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
    listSubjectRecords(this.subject.name).subscribe((records) => {
      this.records = records;
      this.processingComponent.updateRecords(records);
      this.preferencesComponent.updateRecords(records);
      this.conditionsComponent.updateRecords(records);
    });
  }

  editSubject(): void {
    this.dialog.open<SubjectInfosEditorDialogComponent, SubjectDto>(SubjectInfosEditorDialogComponent, {data: this.subject})
      .afterClosed().pipe(
      mergeMap((subject) => {
        if (subject.id) {
          return updateSubject(subject);
        } else {
          return createSubject(subject);
        }
      })
    ).subscribe((subject) => this.subject = subject);
  }

  submitLog(): void {
    listEntries({types: ['information'], tags: [DefaultInfoTag.DEFAULT_INFO_OPERATOR]})
      .subscribe((infos) => {
        if (infos.totalCount === 0) {
          console.error('Missing information');
          throw new Error('Missing information');
        } else {
          this.dialog.open<SubjectRecordApplyChangesDialogComponent, SubjectRecordApplyChangesDialogDataOutput>(
            SubjectRecordApplyChangesDialogComponent,
            {width: '45vw', data: {recipient: this.subject.emailAddress}})
            .afterClosed().subscribe((result) => {
            if (result) {
              const ctx: ConsentContext = {
                layoutData: {
                  type: 'layout',
                  orientation: FormLayoutOrientation.VERTICAL,
                  existingElementsVisible: true,
                  info: infos.values[0].key,
                  elements: this.operatorLog.map(e => e.key),
                  defaultNotification: result.email,
                  includeIFrameResizer: true,
                },
                origin: ConsentOrigin.OPERATOR,
                subject: this.subject.name,
                object: result.object,
                callback: '',
                language: this.defaultLanguage,
                subjectInfos: {},
                attributes: {},
                author: '',
                confirmation: Confirmation.NONE,
                theme: '',
              };

              if (result.email) {
                ctx.subjectInfos[SubjectInfosKeys.EMAIL_KEY] = result.recipient;
              }

              createTransactionJson(ctx, this.translate.currentLang).pipe(
                mergeMap((transaction: ConsentTransaction) => {
                  const values = {comment: [result.comment]};
                  this.operatorLog.forEach(element => values[element.identifier] = [element.value]);
                  return postSubmissionValuesJson(transaction.id, values);
                })
              ).subscribe(() => {
                this.operatorLog = [];
                this.reloadRecords();

                if (this.subject.creationTimestamp <= 0) {
                  getSubject(this.subject.name).subscribe((subject) => this.subject = subject);
                }
              });
            }
          });
        }
      });
  }

}
