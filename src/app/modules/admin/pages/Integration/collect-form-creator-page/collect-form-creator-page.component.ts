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
import { Component, OnInit } from '@angular/core';
import { debounceTime, tap } from 'rxjs/operators';
import { merge, zip } from 'rxjs';
import { CdkDragDrop, copyArrayItem, moveItemInArray } from '@angular/cdk/drag-drop';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { AddMultipleOption, SectionConfig } from '../../../components/entries/entries-library/entries-library.component';
import { environment } from '../../../../../../environments/environment';
import * as _ from 'lodash';
import { MatDialog } from '@angular/material/dialog';
import { FormUrlDialogComponent, FormUrlDialogComponentData } from '../../../components/form-url-dialog/form-url-dialog.component';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ConfigService } from '../../../../../core/services/config.service';
import { ConfirmDialogComponent } from '../../../../../core/components/confirm-dialog/confirm-dialog.component';
import { TranslateService } from '@ngx-translate/core';
import { FIELD_VALIDATORS, Icons } from '../../../../../core/models/common';
import {
  CONSENT_FORM_ORIENTATIONS,
  ConsentOrigin,
  FormLayout,
  FormLayoutOrientation,
  listEntries,
  ModelDataType,
  ModelEntryDto,
  ModelEntryHelper,
  ModelEntryStatus,
  ModelFilter,
  RECEIPT_DISPLAY_TYPES
} from '@fairandsmart/consent-manager/models';
import { ConsentContext, createTransactionJson, getSubmitFormPreview } from '@fairandsmart/consent-manager/consents';

enum FORM_CREATOR_STEP {
  ELEMENTS,
  PREVIEW,
  OPTIONS
}

@Component({
  selector: 'cm-form-creator',
  templateUrl: './collect-form-creator-page.component.html',
  styleUrls: ['./collect-form-creator-page.component.scss'],
  // tslint:disable-next-line:no-host-metadata-property
  host: {
    class: 'side-nav-wrapper',
  },
})
export class CollectFormCreatorPageComponent implements OnInit {

  public elementsLibraryConfig: (SectionConfig & { draggingDisabled: boolean, included: boolean })[] = [
    {
      id: 'infos',
      types: ['basicinfo'],
      canAddMultiple: environment.customization.multipleInfo,
      showActions: environment.customization.multipleInfo === AddMultipleOption.ALWAYS,
      draggingDisabled: false,
      included: true,
      icon: Icons.basicinfo,
      fullSize: false,
      listId: 'infos',
      filter: this.makeDefaultFilter('basicinfo')
    },
    {
      id: 'processing',
      types: ['processing'],
      canAddMultiple: AddMultipleOption.ALWAYS,
      showActions: true,
      draggingDisabled: false,
      included: true,
      icon: Icons.processing,
      fullSize: false,
      listId: 'elements',
      filter: this.makeDefaultFilter('processing')
    },
    {
      id: 'preferences',
      types: ['preference'],
      canAddMultiple: AddMultipleOption.ALWAYS,
      showActions: true,
      draggingDisabled: false,
      included: true,
      icon: Icons.preference,
      fullSize: false,
      listId: 'elements',
      filter: this.makeDefaultFilter('preference')
    },
    {
      id: 'conditions',
      types: ['conditions'],
      canAddMultiple: AddMultipleOption.ALWAYS,
      showActions: true,
      draggingDisabled: false,
      included: true,
      icon: Icons.conditions,
      fullSize: false,
      listId: 'elements',
      filter: this.makeDefaultFilter('conditions')
    }
  ];

  get basicInfoConfig(): (SectionConfig & { draggingDisabled: boolean, included: boolean }) {
    return this.elementsLibraryConfig[0];
  }

  get processingConfig(): (SectionConfig & { draggingDisabled: boolean, included: boolean }) {
    return this.elementsLibraryConfig[1];
  }

  get preferencesConfig(): (SectionConfig & { draggingDisabled: boolean, included: boolean }) {
    return this.elementsLibraryConfig[2];
  }

  get conditionsConfig(): (SectionConfig & { draggingDisabled: boolean, included: boolean }) {
    return this.elementsLibraryConfig[3];
  }

  public selectionConfig = [
    {
      id: 'infos',
      sectionsId: ['infos']
    },
    {
      id: 'elements',
      sectionsId: ['processing', 'preferences', 'conditions']
    }
  ];

  public selectedElements: { [id: string]: ModelEntryDto[] } = {
    infos: [],
    elements: []
  };

  public themesLibraryConfig: SectionConfig[] = [
    {
      id: 'themes',
      types: ['theme'],
      canAddMultiple: AddMultipleOption.NEVER,
      showActions: true,
      icon: Icons.theme,
      fullSize: false,
      filter: this.makeDefaultFilter('theme')
    }
  ];

  public selectedTheme: { [id: string]: ModelEntryDto[] } = {themes: []};

  public emailsLibraryConfig: SectionConfig[] = [
    {
      id: 'emails',
      types: ['email'],
      canAddMultiple: AddMultipleOption.NEVER,
      showActions: true,
      icon: Icons.email,
      fullSize: false,
      filter: this.makeDefaultFilter('email')
    }
  ];

  public selectedEmail: { [id: string]: ModelEntryDto[] } = {emails: []};

  public form: FormArray;
  public safePreview: SafeHtml;
  private previousContext: ConsentContext;
  public currentStep: FORM_CREATOR_STEP;

  public readonly ICONS = Icons;
  public readonly STEPS = FORM_CREATOR_STEP;
  public readonly ORIENTATIONS = CONSENT_FORM_ORIENTATIONS;
  public readonly RECEIPT_FORMATS = RECEIPT_DISPLAY_TYPES;
  public readonly VALIDITY_UNITS = ['D', 'W', 'M', 'Y'];
  private readonly defaultLanguage;

  private static formatValidity(validity, validityUnit): string {
    return validity ? `P${validity}${validityUnit}` : '';
  }

  constructor(private fb: FormBuilder,
              private sanitizer: DomSanitizer,
              private dialog: MatDialog,
              private breakpointObserver: BreakpointObserver,
              private configService: ConfigService,
              private translate: TranslateService) {
    this.defaultLanguage = this.configService.getDefaultLanguage();
  }

  ngOnInit(): void {
    this.breakpointObserver.observe([Breakpoints.XSmall, Breakpoints.Small]).pipe(
      tap((state) => {
        ['elementsLibraryConfig', 'themesLibraryConfig', 'emailsLibraryConfig'].forEach(config => {
          const previous = this[config][0].columns;
          this[config].forEach(c => c.columns = (state.matches ? 1 : 2));
          if (previous !== this[config][0].columns) {
            // Needed to fire change detection
            this[config] = _.cloneDeep(this[config]);
          }
        });
      })
    ).subscribe();
    zip(...this.elementsLibraryConfig.map(c => listEntries(
      {types: c.types, size: 1, statuses: [ModelEntryStatus.ACTIVE]}
    ))).pipe(
      tap((responses) => {
        const selected: { [id: string]: ModelEntryDto[] } = {...this.selectedElements};
        const basicInfoIndexInResponse = this.elementsLibraryConfig.findIndex((c) => c.id === this.basicInfoConfig.id);
        const basicInfoResponse = responses[basicInfoIndexInResponse];
        if (basicInfoResponse?.totalCount === 1 && ModelEntryHelper.hasActiveVersion(basicInfoResponse.values[0])) {
          selected[this.basicInfoConfig.id] = basicInfoResponse.values;
          this.basicInfoConfig.draggingDisabled = true;
        }
        this.setSelectedElements(selected);
      })
    ).subscribe();
    this.form = this.fb.array([
      this.fb.group({
        info: ['', [Validators.required, Validators.pattern(FIELD_VALIDATORS.key.pattern)]],
        elements: [[], [Validators.required, Validators.pattern(FIELD_VALIDATORS.elementsKeys.pattern)]]
      }),
      this.fb.group({
        language: [this.defaultLanguage, [Validators.required]],
        theme: ['', [Validators.pattern(FIELD_VALIDATORS.key.pattern)]],
        acceptAllVisible: [false, [Validators.required]],
        acceptAllText: [''],
        footerOnTop: [false, [Validators.required]],
        orientation: [FormLayoutOrientation.VERTICAL, [Validators.required]],
      }),
      this.fb.group({
        subject: ['', [Validators.required]],
        forceDisplay: [true, [Validators.required]],
        validity: [6, [Validators.required, Validators.min(1)]],
        validityUnit: ['M', [Validators.required]],
        validityVisible: [true],
        desiredReceiptMimeType: ['text/html', [Validators.required]],
        callback: [''],
        iframeOrigin: [''],
        notify: [false],
        notification: [''],
        notificationRecipient: ['']
      })
    ]);
    merge(
      this.form.at(FORM_CREATOR_STEP.PREVIEW).get('language').valueChanges,
      this.form.at(FORM_CREATOR_STEP.PREVIEW).get('theme').valueChanges,
      this.form.at(FORM_CREATOR_STEP.PREVIEW).get('acceptAllVisible').valueChanges,
      this.form.at(FORM_CREATOR_STEP.PREVIEW).get('acceptAllText').valueChanges.pipe(
        debounceTime(500)
      ),
      this.form.at(FORM_CREATOR_STEP.PREVIEW).get('footerOnTop').valueChanges,
      this.form.at(FORM_CREATOR_STEP.PREVIEW).get('orientation').valueChanges,
    ).subscribe(() => {
      if (this.currentStep === FORM_CREATOR_STEP.PREVIEW && this.previousContext != null
        && !_.isEqual(this.buildContext(), this.previousContext)) {
        this.preview();
      }
    });
    this.form.at(FORM_CREATOR_STEP.OPTIONS).get('notify').valueChanges.subscribe((notify: boolean) => {
      if (notify) {
        this.form.at(FORM_CREATOR_STEP.OPTIONS).get('notification')
          .setValidators([Validators.required, Validators.pattern(FIELD_VALIDATORS.key.pattern)]);
        this.form.at(FORM_CREATOR_STEP.OPTIONS).get('notificationRecipient')
          .setValidators([Validators.required, Validators.email]);
      } else {
        this.form.at(FORM_CREATOR_STEP.OPTIONS).get('notification').clearValidators();
        this.form.at(FORM_CREATOR_STEP.OPTIONS).get('notificationRecipient').clearValidators();
        this.setSelectedEmail({emails: []});
        this.form.at(FORM_CREATOR_STEP.OPTIONS).get('notificationRecipient').setValue('');
      }
      this.form.at(FORM_CREATOR_STEP.OPTIONS).get('notification').updateValueAndValidity();
      this.form.at(FORM_CREATOR_STEP.OPTIONS).get('notificationRecipient').updateValueAndValidity();
    });
  }

  elementDropped(event: CdkDragDrop<ModelEntryDto[]>): void {
    if ((event.item.data.type === this.conditionsConfig.id && this.selectedElements.elements.length > 0) ||
      event.item.data.type !== this.conditionsConfig.id && this.selectedElements.elements.find((elem) => elem.type === 'conditions')) {
      this.dialog.open(ConfirmDialogComponent, {
        data: {
          content: this.translate.instant('FORM_CREATOR.FORM_TYPE_ERROR'),
          title: this.translate.instant('FORM_CREATOR.CHANGE_FORM_TYPE')
        }
      }).afterClosed().subscribe((response) => {
        if (response) {
          event.container.data.splice(0, this.selectedElements.elements.length);
          event.currentIndex = 0;
          this.moveItem(event);
        }
      });
    } else {
      this.moveItem(event);
    }
  }

  moveItem(event: CdkDragDrop<ModelEntryDto[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      copyArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
    this.setSelectedElements({...this.selectedElements});
  }

  selectedElementsChange(event: { [id: string]: ModelEntryDto[] }): void {
    this.setSelectedElements(event);
  }

  selectedThemeChange(event: { [id: string]: ModelEntryDto[] }): void {
    this.setSelectedTheme(event);
  }

  selectedEmailChange(event: { [id: string]: ModelEntryDto[] }): void {
    this.setSelectedEmail(event);
  }

  preview(): void {
    if (this.form.at(FORM_CREATOR_STEP.ELEMENTS).invalid || this.form.at(FORM_CREATOR_STEP.PREVIEW).invalid) {
      return;
    }
    const context: ConsentContext = this.buildContext();
    if (_.isEqual(context, this.previousContext)) {
      return;
    }
    this.previousContext = context;
    getSubmitFormPreview(context, this.translate.currentLang).subscribe((html) => {
      this.safePreview = this.sanitizer.bypassSecurityTrustHtml(html.replace(/\/assets\//g, `${environment.managerUrl}/assets/`));
    }, (err) => {
      console.error(err);
      this.safePreview = '';
    });
  }

  stepChange(event: StepperSelectionEvent): void {
    this.currentStep = event.selectedIndex;
    if (this.currentStep === FORM_CREATOR_STEP.ELEMENTS) {
      this.updateAcceptAll();
    }
    if (this.currentStep === FORM_CREATOR_STEP.PREVIEW) {
      this.preview();
    }
  }

  private makeDefaultFilter(type: ModelDataType): ModelFilter {
    return {
      types: [type],
      page: 0,
      size: 6,
      order: 'name',
      direction: 'asc',
      keyword: '',
      statuses: [ModelEntryStatus.ACTIVE],
      languages: [this.configService.getDefaultLanguage()]
    };
  }

  private buildContext(): ConsentContext {
    const formValue: Partial<ConsentContext & FormLayout & { forceDisplay: boolean, validityUnit: string }> = {
      ...(this.form.at(FORM_CREATOR_STEP.OPTIONS) as FormGroup).getRawValue(),
      ...(this.form.at(FORM_CREATOR_STEP.ELEMENTS) as FormGroup).getRawValue(),
      ...(this.form.at(FORM_CREATOR_STEP.PREVIEW) as FormGroup).getRawValue()
    };
    return {
      subject: formValue.subject,
      callback: formValue.callback,
      iframeOrigin: formValue.iframeOrigin,
      validity: CollectFormCreatorPageComponent.formatValidity(formValue.validity, formValue.validityUnit),
      language: formValue.language,
      userinfos: {},
      attributes: {},
      notificationRecipient: formValue.notificationRecipient,
      author: '',
      origin: ConsentOrigin.WEBFORM,
      layoutData: {
        type: 'layout',
        theme: formValue.theme,
        existingElementsVisible: formValue.forceDisplay,
        acceptAllVisible: formValue.acceptAllVisible,
        acceptAllText: formValue.acceptAllText,
        footerOnTop: formValue.footerOnTop,
        notification: formValue.notification,
        desiredReceiptMimeType: formValue.desiredReceiptMimeType,
        validityVisible: formValue.validityVisible,
        elements: formValue.elements,
        orientation: formValue.orientation,
        info: formValue.info,
        includeIFrameResizer: true,
      }
    };
  }

  private setSelectedElements(selected: { [id: string]: ModelEntryDto[] }): void {
    this.selectedElements = selected;
    this.form.at(FORM_CREATOR_STEP.ELEMENTS).patchValue({
      info: this.selectedElements.infos.map(e => e.key)?.[0] || '',
      elements: this.selectedElements.elements.map(e => e.key)
    });
    this.updateAcceptAll();
  }

  private setSelectedTheme(selected: { [id: string]: ModelEntryDto[] }): void {
    this.selectedTheme = selected;
    this.form.at(FORM_CREATOR_STEP.PREVIEW).get('theme')
      .setValue(this.selectedTheme.themes?.[0]?.key || '');
    this.preview();
  }

  private setSelectedEmail(selected: { [id: string]: ModelEntryDto[] }): void {
    this.selectedEmail = selected;
    this.form.at(FORM_CREATOR_STEP.OPTIONS).get('notification')
      .setValue(this.selectedEmail.emails?.[0]?.key || '');
  }

  openApiUrlDialog(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.form.disable();
    const context: ConsentContext = this.buildContext();
    if (context === this.previousContext) {
      return;
    }
    createTransactionJson(context, this.translate.currentLang).subscribe((url) => {
      this.form.enable();
      this.dialog.open<FormUrlDialogComponent, FormUrlDialogComponentData>(FormUrlDialogComponent, {
        width: '800px',
        data: {
          url: url,
          context: context
        }
      });
    }, (err) => {
      console.error(err);
      this.form.enable();
    });
  }

  isSelectionExcluded(config: { id: string; sectionsId: string[] }): boolean {
    return this.elementsLibraryConfig.every(section => config.sectionsId.includes(section.id) && !section.included);
  }

  isSelectionDraggable(config: { id: string; sectionsId: string[] }): boolean {
    return this.elementsLibraryConfig.some(section => config.sectionsId.includes(section.id) && !section.draggingDisabled);
  }

  getSelectionAvailableLists(config: { id: string; sectionsId: string[] }): string[] {
    return this.elementsLibraryConfig.filter(section => config.sectionsId.includes(section.id)).map(section => 'available-' + section.id);
  }

  getFormGroup(form: FormArray, step: FORM_CREATOR_STEP): FormGroup {
    return form.at(step) as FormGroup;
  }

  private updateAcceptAll(): void {
    if (this.selectedElements.elements.filter(e => e.type === 'processing').length > 1) {
      this.form.at(FORM_CREATOR_STEP.PREVIEW).get('acceptAllVisible').enable();
    } else {
      this.form.at(FORM_CREATOR_STEP.PREVIEW).get('acceptAllVisible').setValue(false);
      this.form.at(FORM_CREATOR_STEP.PREVIEW).get('acceptAllVisible').disable();
    }
  }
}
