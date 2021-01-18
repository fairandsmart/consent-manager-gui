import { Component, OnInit } from '@angular/core';
import { ModelsResourceService } from '../../../../../core/http/models-resource.service';
import {
  CollectionMethod,
  CONSENT_FORM_ORIENTATIONS,
  ConsentContext,
  ConsentFormOrientation,
  ConsentFormType,
  FIELD_VALIDATORS,
  Icons,
  ModelEntryDto,
  RECEIPT_DISPLAY_TYPES
} from '../../../../../core/models/models';
import { debounceTime, tap } from 'rxjs/operators';
import { merge, zip } from 'rxjs';
import { CdkDragDrop, copyArrayItem, moveItemInArray } from '@angular/cdk/drag-drop';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConsentsResourceService } from '../../../../../core/http/consents-resource.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { AddMultipleOption, SectionConfig } from '../../../components/entries/entries-library/entries-library.component';
import { environment } from '../../../../../../environments/environment';
import * as _ from 'lodash';
import { MatDialog } from '@angular/material/dialog';
import { FormUrlDialogComponent, FormUrlDialogComponentData } from '../../../components/form-url-dialog/form-url-dialog.component';
import { hasActiveVersion } from '../../../../../core/utils/model-entry.utils';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import {ConfigService} from '../../../../../core/services/config.service';

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

  readonly ICONS = Icons;

  public elementsLibraryConfig: (SectionConfig & { draggingDisabled: boolean, included: boolean })[] = [
    {
      id: 'infos',
      types: ['basicinfo'],
      canAddMultiple: environment.customization.multipleInfo,
      showSort: environment.customization.multipleInfo === AddMultipleOption.ALWAYS,
      draggingDisabled: false,
      included: true,
      icon: Icons.basicinfo,
      displayDescription: false,
      listId: 'infos'
    },
    {
      id: 'processing',
      types: ['processing'],
      canAddMultiple: AddMultipleOption.ALWAYS,
      showSort: true,
      draggingDisabled: false,
      included: true,
      icon: Icons.processing,
      displayDescription: false,
      listId: 'elements'
    },
    {
      id: 'preferences',
      types: ['preference'],
      canAddMultiple: AddMultipleOption.ALWAYS,
      showSort: true,
      draggingDisabled: false,
      included: true,
      icon: Icons.preference,
      displayDescription: false,
      listId: 'elements'
    }
  ];

  public selectionConfig = [
    {
      id: 'infos',
      sectionsId: ['infos']
    },
    {
      id: 'elements',
      sectionsId: ['processing', 'preferences']
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
      showSort: true,
      icon: Icons.theme,
      displayDescription: false
    }
  ];

  public selectedTheme: { [id: string]: ModelEntryDto[] } = {themes: []};

  public emailsLibraryConfig: SectionConfig[] = [
    {
      id: 'emails',
      types: ['email'],
      canAddMultiple: AddMultipleOption.NEVER,
      showSort: true,
      icon: Icons.email,
      displayDescription: false
    }
  ];

  public selectedEmail: { [id: string]: ModelEntryDto[] } = {emails: []};

  public form: FormArray;
  public readonly STEPS = FORM_CREATOR_STEP;
  public readonly ORIENTATIONS = CONSENT_FORM_ORIENTATIONS;
  public readonly RECEIPT_FORMATS = RECEIPT_DISPLAY_TYPES;
  public readonly VALIDITY_UNITS = ['D', 'W', 'M', 'Y'];

  public formUrl: SafeResourceUrl;
  private previousContext: ConsentContext;
  public currentStep: FORM_CREATOR_STEP;

  private readonly defaultLanguage;

  private static formatValidity(validity, validityUnit): string {
    if (validity) {
      if (validityUnit === 'W') {
        const days: number = validity * 7;
        return `P${days}D`;
      } else {
        return `P${validity}${validityUnit}`;
      }
    }
    return '';
  }

  constructor(private consentsResource: ConsentsResourceService,
              private modelsResource: ModelsResourceService,
              private fb: FormBuilder,
              private sanitizer: DomSanitizer,
              private dialog: MatDialog,
              private breakpointObserver: BreakpointObserver,
              private configService: ConfigService) {
    this.defaultLanguage = this.configService.config.language;
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
    zip(...this.elementsLibraryConfig.map(c => this.modelsResource.listEntries({types: c.types, size: 1}))).pipe(
      tap((responses) => {
        const selected: { [id: string]: ModelEntryDto[] } = {...this.selectedElements};
        responses.forEach((response, index) => {
          if (response.totalCount === 1 && hasActiveVersion(response.values[0])) {
            const config = this.elementsLibraryConfig[index];
            selected[config.id] = response.values;
            config.draggingDisabled = true;
          }
        });
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
        orientation: [ConsentFormOrientation.VERTICAL, [Validators.required]],
      }),
      this.fb.group({
        subject: ['', [Validators.required]],
        forceDisplay: [true, [Validators.required]],
        validity: [6, [Validators.required, Validators.min(1)]],
        validityUnit: ['M', [Validators.required]],
        validityVisible: [true],
        receiptDisplayType: ['HTML', [Validators.required]],
        notify: [true],
        notificationModel: ['', [Validators.required, Validators.pattern(FIELD_VALIDATORS.key.pattern)]],
        notificationRecipient: ['', [Validators.required, Validators.email]]
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
        && !_.isEqual(this.buildContext(true), this.previousContext)) {
        this.preview();
      }
    });
    this.form.at(FORM_CREATOR_STEP.OPTIONS).get('notify').valueChanges.subscribe((notify: boolean) => {
      if (notify) {
        this.form.at(FORM_CREATOR_STEP.OPTIONS).get('notificationModel')
          .setValidators([Validators.required, Validators.pattern(FIELD_VALIDATORS.key.pattern)]);
        this.form.at(FORM_CREATOR_STEP.OPTIONS).get('notificationRecipient')
          .setValidators([Validators.required, Validators.email]);
      } else {
        this.form.at(FORM_CREATOR_STEP.OPTIONS).get('notificationModel').clearValidators();
        this.form.at(FORM_CREATOR_STEP.OPTIONS).get('notificationRecipient').clearValidators();
        this.setSelectedEmail({emails: []});
        this.form.at(FORM_CREATOR_STEP.OPTIONS).get('notificationRecipient').setValue('');
      }
      this.form.at(FORM_CREATOR_STEP.OPTIONS).get('notificationModel').updateValueAndValidity();
      this.form.at(FORM_CREATOR_STEP.OPTIONS).get('notificationRecipient').updateValueAndValidity();
    });
  }

  elementDropped(event: CdkDragDrop<ModelEntryDto[]>): void {
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
    const context: ConsentContext = this.buildContext(true);
    if (_.isEqual(context, this.previousContext)) {
      return;
    }
    this.previousContext = context;
    this.consentsResource.generateToken(context).subscribe((token) => {
      this.formUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.consentsResource.getFormUrl(token));
    }, (err) => {
      console.error(err);
      this.formUrl = '';
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

  private buildContext(isPreview: boolean): ConsentContext {
    const formValue: Partial<ConsentContext & { forceDisplay: boolean, validityUnit: string }> = {
      ...(this.form.at(FORM_CREATOR_STEP.OPTIONS) as FormGroup).getRawValue(),
      ...(this.form.at(FORM_CREATOR_STEP.ELEMENTS) as FormGroup).getRawValue(),
      ...(this.form.at(FORM_CREATOR_STEP.PREVIEW) as FormGroup).getRawValue()
    };
    return {
      subject: formValue.subject,
      orientation: formValue.orientation,
      info: formValue.info,
      elements: formValue.elements,
      callback: '',
      validity: CollectFormCreatorPageComponent.formatValidity(formValue.validity, formValue.validityUnit),
      validityVisible: formValue.validityVisible,
      language: formValue.language,
      formType: formValue.forceDisplay ? ConsentFormType.FULL : ConsentFormType.PARTIAL,
      receiptDisplayType: formValue.receiptDisplayType,
      userinfos: {},
      attributes: {},
      notificationModel: formValue.notificationModel,
      notificationRecipient: formValue.notificationRecipient,
      collectionMethod: CollectionMethod.WEBFORM,
      author: '',
      preview: isPreview,
      iframe: true,
      theme: formValue.theme,
      acceptAllVisible: formValue.acceptAllVisible,
      acceptAllText: formValue.acceptAllText,
      footerOnTop: formValue.footerOnTop
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
    this.form.at(FORM_CREATOR_STEP.OPTIONS).get('notificationModel')
      .setValue(this.selectedEmail.emails?.[0]?.key || '');
  }

  openApiUrlDialog(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.form.disable();
    const context: ConsentContext = this.buildContext(false);
    if (context === this.previousContext) {
      return;
    }
    this.consentsResource.generateToken(context).subscribe((token) => {
      this.form.enable();
      const url = this.consentsResource.getFormUrl(token);
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
