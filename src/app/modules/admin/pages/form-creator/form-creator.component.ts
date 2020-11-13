import { Component, OnInit } from '@angular/core';
import { ModelsResourceService } from '../../../../core/http/models-resource.service';
import {
  CollectionMethod,
  CONSENT_FORM_ORIENTATIONS,
  ConsentContext,
  ConsentFormOrientation,
  ConsentFormType,
  FIELD_VALIDATORS,
  Icons,
  ModelEntryDto,
  RECEIPT_DELIVERY_TYPES
} from '../../../../core/models/models';
import { tap } from 'rxjs/operators';
import { zip } from 'rxjs';
import { CdkDragDrop, copyArrayItem, moveItemInArray } from '@angular/cdk/drag-drop';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { ConsentsResourceService } from '../../../../core/http/consents-resource.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { SectionConfig } from '../../components/entries/entries-library/entries-library.component';
import { environment } from '../../../../../environments/environment';
import * as _ from 'lodash';
import { MatDialog } from '@angular/material/dialog';
import { FormUrlDialogComponent, FormUrlDialogComponentData } from '../../components/form-url-dialog/form-url-dialog.component';
import { hasActiveVersion } from '../../../../core/utils/model-entry.utils';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

enum FORM_CREATOR_STEP {
  ELEMENTS,
  PREVIEW,
  OPTIONS
}

@Component({
  selector: 'cm-form-creator',
  templateUrl: './form-creator.component.html',
  styleUrls: ['./form-creator.component.scss'],
  // tslint:disable-next-line:no-host-metadata-property
  host: {
    class: 'side-nav-wrapper',
  },
})
export class FormCreatorComponent implements OnInit {

  readonly ICONS = Icons;

  public elementsLibraryConfig: (SectionConfig & {draggingDisabled: boolean, included: boolean})[] = [
    {
      id: 'infos',
      types: ['basicinfo'],
      multiple: environment.customization.multipleInfo,
      showSort: environment.customization.multipleInfo,
      draggingDisabled: false,
      included: true,
      icon: Icons.basicinfo,
      displayDescription: false
    },
    {
      id: 'processing',
      types: ['processing'],
      multiple: true,
      showSort: true,
      draggingDisabled: false,
      included: true,
      icon: Icons.processing,
      displayDescription: false
    },
  ];

  public selectedElements: {[id: string]: ModelEntryDto[]} = {
    infos: [],
    processing: []
  };

  public themesLibraryConfig: SectionConfig[] = [
    {
      id: 'themes',
      types: ['theme'],
      multiple: false,
      showSort: true,
      icon: Icons.theme,
      displayDescription: false
    }
  ];

  public selectedTheme: {[id: string]: ModelEntryDto[]} = {themes: []};

  public emailsLibraryConfig: SectionConfig[] = [
    {
      id: 'emails',
      types: ['email'],
      multiple: false,
      showSort: true,
      icon: Icons.email,
      displayDescription: false
    }
  ];

  public selectedEmail: {[id: string]: ModelEntryDto[]} = {emails: []};

  public form: FormArray;
  public readonly STEPS = FORM_CREATOR_STEP;
  public readonly ORIENTATIONS = CONSENT_FORM_ORIENTATIONS;
  public readonly RECEIPT_TYPES = RECEIPT_DELIVERY_TYPES;
  public readonly VALIDITY_UNITS = ['D', 'W', 'M', 'Y'];

  public formUrl: SafeResourceUrl;
  private previousContext: ConsentContext;
  private previousOrientation: ConsentFormOrientation;
  private previousLanguage: string;
  public currentStep: FORM_CREATOR_STEP;

  private readonly defaultLanguage = environment.customization.defaultLanguage;

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
              private breakpointObserver: BreakpointObserver) { }

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
        const selected: {[id: string]: ModelEntryDto[]} = {...this.selectedElements};
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
        theme: ['', [Validators.pattern(FIELD_VALIDATORS.key.pattern)]],
      }),
      this.fb.group({
        subject: ['', [Validators.required]],
        orientation: [ConsentFormOrientation.VERTICAL, [Validators.required]],
        language: [this.defaultLanguage, [Validators.required]],
        forceDisplay: [true, [Validators.required]],
        validity: [6, [Validators.required, Validators.min(1)]],
        validityUnit: ['M', [Validators.required]],
        receiptDeliveryType: ['DISPLAY', [Validators.required]],
        notificationModel: ['', [Validators.pattern(FIELD_VALIDATORS.key.pattern)]],
        notificationRecipient: ['']
      })
    ]);
    this.form.at(FORM_CREATOR_STEP.OPTIONS).get('orientation').valueChanges.subscribe((orientation) => {
      if (this.currentStep === FORM_CREATOR_STEP.PREVIEW && this.previousOrientation !== orientation
        && this.previousContext != null && this.previousContext.orientation !== orientation) {
        this.previousOrientation = orientation;
        this.preview();
      }
    });
    this.form.at(FORM_CREATOR_STEP.OPTIONS).get('language').valueChanges.subscribe((language) => {
      if (this.currentStep === FORM_CREATOR_STEP.PREVIEW && this.previousLanguage !== language
        && this.previousContext != null && this.previousContext.language !== language) {
        this.previousLanguage = language;
        this.preview();
      }
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

  selectedElementsChange(event: {[id: string]: ModelEntryDto[]}): void {
    this.setSelectedElements(event);
  }

  selectedThemeChange(event: {[id: string]: ModelEntryDto[]}): void {
    this.setSelectedTheme(event);
  }

  selectedEmailChange(event: {[id: string]: ModelEntryDto[]}): void {
    this.setSelectedEmail(event);
  }

  preview(): void {
    if (this.form.at(FORM_CREATOR_STEP.ELEMENTS).invalid || this.form.at(FORM_CREATOR_STEP.PREVIEW).invalid) {
      return;
    }
    this.form.disable();
    const context: ConsentContext = this.buildContext(true);
    if (_.isEqual(context, this.previousContext)) {
      this.form.enable();
      return;
    }
    this.consentsResource.generateToken(context).subscribe((token) => {
      this.previousContext = context;
      this.formUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.consentsResource.getFormUrl(token));
      this.form.enable();
    }, (err) => {
      console.error(err);
      this.form.enable();
      this.formUrl = '';
    });
  }

  stepChange(event: StepperSelectionEvent): void {
    this.currentStep = event.selectedIndex;
    if (event.selectedIndex === FORM_CREATOR_STEP.PREVIEW) {
      this.preview();
    }
  }

  private buildContext(isPreview: boolean): ConsentContext {
    const formValue: Partial<ConsentContext & {forceDisplay: boolean, validityUnit: string}> = {
      ...this.form.at(FORM_CREATOR_STEP.OPTIONS).value,
      ...this.form.at(FORM_CREATOR_STEP.ELEMENTS).value,
      ...this.form.at(FORM_CREATOR_STEP.PREVIEW).value
    };
    return {
      subject: formValue.subject,
      orientation: formValue.orientation,
      info: formValue.info,
      elements: formValue.elements,
      callback: '',
      validity: FormCreatorComponent.formatValidity(formValue.validity, formValue.validityUnit),
      language: formValue.language,
      formType: formValue.forceDisplay ? ConsentFormType.FULL : ConsentFormType.PARTIAL,
      receiptDeliveryType: formValue.receiptDeliveryType,
      userinfos: {},
      attributes: {},
      notificationModel: formValue.notificationModel,
      notificationRecipient: formValue.notificationRecipient,
      collectionMethod: CollectionMethod.WEBFORM,
      author: '',
      preview: isPreview,
      iframe: true,
      theme: formValue.theme
    };
  }

  private setSelectedElements(selected: {[id: string]: ModelEntryDto[]}): void {
    this.selectedElements = selected;
    this.form.at(FORM_CREATOR_STEP.ELEMENTS).setValue({
      info: this.selectedElements.infos.map(e => e.key)?.[0] || '',
      elements: this.selectedElements.processing.map(e => e.key)
    });
  }

  private setSelectedTheme(selected: {[id: string]: ModelEntryDto[]}): void {
    this.selectedTheme = selected;
    this.form.at(FORM_CREATOR_STEP.PREVIEW).patchValue({
      theme: this.selectedTheme.themes?.[0]?.key || ''
    });
    this.preview();
  }

  private setSelectedEmail(selected: {[id: string]: ModelEntryDto[]}): void {
    this.selectedEmail = selected;
    this.form.at(FORM_CREATOR_STEP.OPTIONS).patchValue({
      notificationModel: this.selectedEmail.emails?.[0]?.key || ''
    });
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
}
