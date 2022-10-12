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
import {
  AddMultipleOption,
  SectionConfig
} from '../../../components/entries/entries-library/entries-library.component';
import { environment } from '../../../../../../environments/environment';
import * as _ from 'lodash';
import { MatDialog } from '@angular/material/dialog';
import {
  FormUrlDialogComponent,
  FormUrlDialogComponentData
} from '../../../components/form-url-dialog/form-url-dialog.component';
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
  PeerElements
} from '@fairandsmart/consents-ce/models';
import {
  Confirmation,
  CONFIRMATION_TYPES,
  ConfirmationConfigKeys,
  ConsentContext,
  ConsentTransaction,
  createTransactionJson,
  getSubmitFormPreview,
  SubjectInfosKeys
} from '@fairandsmart/consents-ce/consents';
import { HttpHeaders } from '@angular/common/http';
import { listPeers, Peer } from '@fairandsmart/consents-ce/peers';

enum FORM_CREATOR_STEP {
  ELEMENTS,
  PREVIEW,
  OPTIONS
}

type DraggableConfig = (SectionConfig & { draggingDisabled: boolean; included: boolean });

interface SelectionConfig {
  id: string;
  name: string;
  peer?: Peer;
  sectionsId: string[];
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

  public elementsLibraryConfig: DraggableConfig[] = [
    {
      id: 'infos',
      types: ['information'],
      canAddMultiple: environment.customization.multipleInfo,
      showActions: environment.customization.multipleInfo === AddMultipleOption.ALWAYS,
      draggingDisabled: false,
      included: true,
      icon: Icons.information,
      fullSize: false,
      listId: 'infos',
      filter: this.makeDefaultFilter('information')
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

  public peerElementsLibraryConfigs: { peer: Peer, config: DraggableConfig[] }[] = [];

  get informationConfig(): DraggableConfig {
    return this.elementsLibraryConfig[0];
  }

  get processingsConfig(): DraggableConfig {
    return this.elementsLibraryConfig[1];
  }

  get preferencesConfig(): DraggableConfig {
    return this.elementsLibraryConfig[2];
  }

  get conditionsConfig(): DraggableConfig {
    return this.elementsLibraryConfig[3];
  }

  public selectionConfig: SelectionConfig[] = [
    {
      id: 'infos',
      name: 'infos',
      sectionsId: ['infos']
    },
    {
      id: 'elements',
      name: 'elements',
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
  public hasCondition = false;
  public hasProcessing = false;

  public peers: Peer[];

  public readonly ICONS = Icons;
  public readonly STEPS = FORM_CREATOR_STEP;
  public readonly ORIENTATIONS = CONSENT_FORM_ORIENTATIONS;
  public readonly VALIDITY_UNITS = ['D', 'W', 'M', 'Y'];
  public readonly CONFIRMATION_TYPES = CONFIRMATION_TYPES;
  public readonly CONFIRMATION = Confirmation;
  public readonly CONFIRMATION_CONFIG_KEYS = ConfirmationConfigKeys;
  public readonly SUBJECT_INFOS_KEYS = SubjectInfosKeys;
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

    this.form = this.fb.array([
      this.fb.group({
        info: [[], [Validators.pattern(FIELD_VALIDATORS.key.pattern), Validators.maxLength(1)]],
        elements: [[], [Validators.required, Validators.pattern(FIELD_VALIDATORS.elementsKeys.pattern)]],
        peerForms: this.fb.group({})
      }),
      this.fb.group({
        language: [this.defaultLanguage, [Validators.required]],
        theme: ['', [Validators.pattern(FIELD_VALIDATORS.key.pattern)]],
        acceptAllVisible: [false, [Validators.required]],
        acceptAllText: [''],
        submitText: [''],
        cancelVisible: [false],
        cancelText: [''],
        footerOnTop: [false, [Validators.required]],
        orientation: [FormLayoutOrientation.VERTICAL, [Validators.required]],
      }),
      this.fb.group({
        subject: ['', [Validators.required]],
        object: [''],
        forceDisplay: [true, [Validators.required]],
        validity: [6, [Validators.required, Validators.min(1)]],
        validityUnit: ['M', [Validators.required]],
        validityVisible: [true],
        updatable: [true],
        callback: [''],
        iframeOrigin: [''],
        notify: [false],
        notification: [''],
        confirmation: [Confirmation.NONE, [Validators.required]]
      })
    ]);

    listPeers().subscribe((peers) => {
      this.peers = peers;
      this.peers.forEach((peer) => {
        this.peerElementsLibraryConfigs.push(this.makePeerConfig(peer));
        this.selectionConfig.push({
          id: `${peer.id}/infos`,
          name: 'infos',
          sectionsId: [`${peer.id}/infos`],
          peer: peer,
        });
        this.selectionConfig.push({
          id: `${peer.id}/elements`,
          name: 'elements',
          sectionsId: [`${peer.id}/processing`, `${peer.id}/preferences`, `${peer.id}/conditions`],
          peer: peer,
        });
        this.selectedElements[`${peer.id}/infos`] = [];
        this.selectedElements[`${peer.id}/elements`] = [];
        (this.form.at(this.STEPS.ELEMENTS).get('peerForms') as FormGroup)
          .addControl(peer.id, this.fb.group({
            info: [[], [Validators.pattern(FIELD_VALIDATORS.key.pattern), Validators.maxLength(1)]],
            elements: [[], [Validators.pattern(FIELD_VALIDATORS.elementsKeys.pattern)]],
          }));
      });

      zip(...this.elementsLibraryConfig.map(c => listEntries(
        {types: c.types, size: 1, statuses: [ModelEntryStatus.ACTIVE]}
      ))).pipe(
        tap((responses) => {
          const selected: { [id: string]: ModelEntryDto[] } = {...this.selectedElements};
          const informationIndexInResponse = this.elementsLibraryConfig.findIndex((c) => c.id === this.informationConfig.id);
          const informationResponse = responses[informationIndexInResponse];
          if (informationResponse?.totalCount === 1 && ModelEntryHelper.hasActiveVersion(informationResponse.values[0])) {
            selected[this.informationConfig.id] = informationResponse.values;
          }
          this.setSelectedElements(selected);
        })
      ).subscribe();
    });

    const subjectInfos = this.fb.group({});
    subjectInfos.addControl(this.SUBJECT_INFOS_KEYS.EMAIL_KEY, this.fb.control(''));
    (this.form.at(FORM_CREATOR_STEP.OPTIONS) as FormGroup).addControl('subjectInfos', subjectInfos);

    const confirmationConfig = this.fb.group({});
    confirmationConfig.addControl(this.CONFIRMATION_CONFIG_KEYS.SENDER_EMAIL_KEY, this.fb.control(''));
    (this.form.at(FORM_CREATOR_STEP.OPTIONS) as FormGroup).addControl('confirmationConfig', confirmationConfig);

    merge(
      this.form.at(FORM_CREATOR_STEP.PREVIEW).get('language').valueChanges,
      this.form.at(FORM_CREATOR_STEP.PREVIEW).get('theme').valueChanges,
      this.form.at(FORM_CREATOR_STEP.PREVIEW).get('acceptAllVisible').valueChanges,
      this.form.at(FORM_CREATOR_STEP.PREVIEW).get('acceptAllText').valueChanges.pipe(
        debounceTime(500)
      ),
      this.form.at(FORM_CREATOR_STEP.PREVIEW).get('submitText').valueChanges.pipe(
        debounceTime(500)
      ),
      this.form.at(FORM_CREATOR_STEP.PREVIEW).get('cancelVisible').valueChanges,
      this.form.at(FORM_CREATOR_STEP.PREVIEW).get('cancelText').valueChanges.pipe(
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
      } else {
        this.form.at(FORM_CREATOR_STEP.OPTIONS).get('notification').clearValidators();
        this.setSelectedEmail({emails: []});
      }
      this.form.at(FORM_CREATOR_STEP.OPTIONS).get('notification').updateValueAndValidity();
      this.updateEmailValidators(notify || this.form.at(FORM_CREATOR_STEP.OPTIONS).get('confirmation').value === Confirmation.EMAIL_CODE);
    });

    this.form.at(FORM_CREATOR_STEP.OPTIONS).get('confirmation').valueChanges.subscribe((confirmation: Confirmation) => {
      if (confirmation === Confirmation.EMAIL_CODE) {
        this.form.at(FORM_CREATOR_STEP.OPTIONS).get('confirmationConfig')
          .get(this.CONFIRMATION_CONFIG_KEYS.SENDER_EMAIL_KEY).setValidators([Validators.required, Validators.email]);
      } else {
        this.form.at(FORM_CREATOR_STEP.OPTIONS).get('confirmationConfig')
          .get(this.CONFIRMATION_CONFIG_KEYS.SENDER_EMAIL_KEY).clearValidators();
      }
      this.form.at(FORM_CREATOR_STEP.OPTIONS).get('confirmationConfig')
        .get(this.CONFIRMATION_CONFIG_KEYS.SENDER_EMAIL_KEY).updateValueAndValidity();
      this.updateEmailValidators(this.form.at(FORM_CREATOR_STEP.OPTIONS).get('notification').value
        || confirmation === Confirmation.EMAIL_CODE);
    });

    this.form.at(FORM_CREATOR_STEP.PREVIEW).get('cancelVisible').valueChanges.subscribe((value) => this.updateCancellable(value));
  }

  makePeerConfig(peer: Peer): { peer: Peer, config: DraggableConfig[] } {
    const elementsLibraryConfig = _.cloneDeep(this.elementsLibraryConfig);
    elementsLibraryConfig.forEach((config) => {
      config.name = config.id;
      config.id = `${peer.id}/${config.id}`;
      config.listId = `${peer.id}/${config.listId}`;
      config.showActions = true;
    });
    return {peer: peer, config: elementsLibraryConfig};
  }

  updateEmailValidators(isRequired: boolean): void {
    if (isRequired) {
      this.form.at(FORM_CREATOR_STEP.OPTIONS).get('subjectInfos').get(this.SUBJECT_INFOS_KEYS.EMAIL_KEY)
        .setValidators([Validators.required, Validators.email]);
    } else {
      this.form.at(FORM_CREATOR_STEP.OPTIONS).get('subjectInfos').get(this.SUBJECT_INFOS_KEYS.EMAIL_KEY).clearValidators();
    }
    this.form.at(FORM_CREATOR_STEP.OPTIONS).get('subjectInfos').get(this.SUBJECT_INFOS_KEYS.EMAIL_KEY).updateValueAndValidity();
  }

  elementDropped(event: CdkDragDrop<ModelEntryDto[]>): void {
    if ((event.item.data.type === this.conditionsConfig.id && this.selectedElements.elements.length > 0) ||
      event.item.data.type !== this.conditionsConfig.id && event.item.data.type !== 'information'
      && this.selectedElements.elements.find((elem) => elem.type === 'conditions')) {
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
      this.safePreview = this.sanitizer.bypassSecurityTrustHtml(html.replace(/"\/assets\//g, `"${environment.managerUrl}/assets/`));
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
      this.updateCancellable(this.form.at(FORM_CREATOR_STEP.PREVIEW).get('cancelVisible').value);
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
      ...(this.form.at(FORM_CREATOR_STEP.ELEMENTS) as FormGroup).getRawValue(),
      ...(this.form.at(FORM_CREATOR_STEP.PREVIEW) as FormGroup).getRawValue(),
      ...(this.form.at(FORM_CREATOR_STEP.OPTIONS) as FormGroup).getRawValue(),
    };
    const rawPeerForms = ((this.form.at(FORM_CREATOR_STEP.ELEMENTS) as FormGroup).get('peerForms') as FormGroup).getRawValue();
    const peerElements: PeerElements[] = [];
    this.peers.forEach((peer) => {
      if (rawPeerForms[peer.id].info.length > 0 || rawPeerForms[peer.id].elements.length > 0) {
        peerElements.push({
          peer: peer.id,
          info: rawPeerForms[peer.id].info?.[0] || '',
          elements: rawPeerForms[peer.id].elements,
          notification: ''
        });
      }
    });
    return {
      subject: formValue.subject,
      object: formValue.object,
      updatable: formValue.updatable,
      callback: formValue.callback,
      iframeOrigin: formValue.iframeOrigin,
      validity: CollectFormCreatorPageComponent.formatValidity(formValue.validity, formValue.validityUnit),
      language: formValue.language,
      subjectInfos: formValue.subjectInfos,
      attributes: {},
      author: '',
      origin: ConsentOrigin.WEBFORM,
      confirmation: formValue.confirmation,
      confirmationConfig: formValue.confirmationConfig,
      notification: formValue.notification,
      theme: formValue.theme,
      layoutData: {
        type: 'layout',
        existingElementsVisible: formValue.forceDisplay,
        acceptAllVisible: formValue.acceptAllVisible,
        acceptAllText: formValue.acceptAllText,
        footerOnTop: formValue.footerOnTop,
        submitText: formValue.submitText,
        cancelVisible: formValue.cancelVisible,
        cancelText: formValue.cancelText,
        validityVisible: formValue.validityVisible,
        elements: formValue.elements,
        orientation: formValue.orientation,
        info: formValue.info?.[0] || '',
        includeIFrameResizer: true,
        peerElements
      }
    };
  }

  private setSelectedElements(selected: { [id: string]: ModelEntryDto[] }): void {
    this.selectedElements = selected;
    this.form.at(FORM_CREATOR_STEP.ELEMENTS).patchValue({
      info: this.selectedElements.infos.map(e => e.key),
      elements: this.selectedElements.elements.map(e => e.key)
    });
    this.hasCondition = this.selectedElements.elements.find(e => e.type === 'conditions') !== undefined;
    const hadProcessingBefore = this.hasProcessing;
    this.hasProcessing = this.selectedElements.elements.find(e => e.type === 'processing') !== undefined;

    this.peers.forEach((peer) => {
      this.form.at(FORM_CREATOR_STEP.ELEMENTS).get('peerForms').get(peer.id).patchValue({
        info: this.selectedElements[`${peer.id}/infos`].map(e => e.key),
        elements: this.selectedElements[`${peer.id}/elements`].map(e => e.key)
      });
      this.hasCondition ||= this.selectedElements[`${peer.id}/elements`].find(e => e.type === 'conditions') !== undefined;
      this.hasProcessing ||= this.selectedElements[`${peer.id}/elements`].find(e => e.type === 'processing') !== undefined;

      this.form.at(FORM_CREATOR_STEP.ELEMENTS).get('peerForms').get(peer.id).get('info').setValidators(
        this.form.at(FORM_CREATOR_STEP.ELEMENTS).get('peerForms').get(peer.id).get('elements').value.length > 0 ?
          [Validators.required, Validators.pattern(FIELD_VALIDATORS.key.pattern), Validators.maxLength(1)]
          : [Validators.pattern(FIELD_VALIDATORS.key.pattern), Validators.maxLength(1)]);
      this.form.at(FORM_CREATOR_STEP.ELEMENTS).get('peerForms').get(peer.id).get('info').updateValueAndValidity();
    });

    this.form.at(FORM_CREATOR_STEP.ELEMENTS).get('info').setValidators(this.hasProcessing ?
      [Validators.required, Validators.pattern(FIELD_VALIDATORS.key.pattern), Validators.maxLength(1)]
      : [Validators.pattern(FIELD_VALIDATORS.key.pattern), Validators.maxLength(1)]);
    this.form.at(FORM_CREATOR_STEP.ELEMENTS).get('info').updateValueAndValidity();

    if (this.hasProcessing && !hadProcessingBefore) {
      this.dialog.open(ConfirmDialogComponent, {
        data: {
          content: this.translate.instant('FORM_CREATOR.ADDED_PROCESSING.INFORMATION_MANDATORY'),
          title: this.translate.instant('FORM_CREATOR.ADDED_PROCESSING.WARNING'),
          hideCancel: true,
        }
      });
    }
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
    // @ts-ignore
    // tslint:disable-next-line:max-line-length
    createTransactionJson(context, this.translate.currentLang, {data: {extractResponseHeaders: true}}).subscribe((res: { body: ConsentTransaction, headers: HttpHeaders }) => {
      this.form.enable();
      this.dialog.open<FormUrlDialogComponent, FormUrlDialogComponentData>(FormUrlDialogComponent, {
        width: '800px',
        data: {
          url: res.headers.get('Location'),
          context: context
        }
      });
    }, (err) => {
      console.error(err);
      this.form.enable();
    });
  }

  isSelectionExcluded(config: SelectionConfig): boolean {
    if (config.peer) {
      return this.peerElementsLibraryConfigs.find((c) => c.peer.id === config.peer.id).config
        .every(section => config.sectionsId.includes(section.id) && !section.included);
    } else {
      return this.elementsLibraryConfig.every(section => config.sectionsId.includes(section.id) && !section.included);
    }
  }

  isSelectionDraggable(config: SelectionConfig): boolean {
    if (config.peer) {
      return this.peerElementsLibraryConfigs.find((c) => c.peer.id === config.peer.id).config
        .some(section => config.sectionsId.includes(section.id) && !section.draggingDisabled);
    } else {
      return this.elementsLibraryConfig.some(section => config.sectionsId.includes(section.id) && !section.draggingDisabled);
    }
  }

  getSelectionAvailableLists(config: SelectionConfig): string[] {
    if (config.peer) {
      return this.peerElementsLibraryConfigs.find((c) => c.peer.id === config.peer.id).config
        .filter(section => config.sectionsId.includes(section.id)).map(section => 'available-' + section.id);
    } else {
      return this.elementsLibraryConfig.filter(section => config.sectionsId.includes(section.id)).map(section => 'available-' + section.id);
    }
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

  private updateCancellable(value): void {
    if (value) {
      this.form.at(FORM_CREATOR_STEP.PREVIEW).get('cancelText').enable();
    } else {
      this.form.at(FORM_CREATOR_STEP.PREVIEW).get('cancelText').disable();
    }
  }
}
