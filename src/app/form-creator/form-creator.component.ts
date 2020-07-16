import { Component, OnInit } from '@angular/core';
import { ModelsResourceService } from '../models-resource.service';
import {
  CollectionMethod,
  CONSENT_FORM_ORIENTATIONS,
  ConsentContext,
  ConsentFormOrientation,
  ConsentFormType,
  FIELD_VALIDATORS,
  ModelEntry,
  RECEIPT_DELIVERY_TYPES
} from '../models';
import { tap } from 'rxjs/operators';
import { zip } from 'rxjs';
import { CdkDragDrop, copyArrayItem, moveItemInArray } from '@angular/cdk/drag-drop';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { LANGUAGES } from '../common/constants';
import { ConsentsResourceService } from '../consents-resource.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { SectionConfig } from '../entries/entries-library/entries-library.component';
import { environment } from '../../environments/environment';

enum FORM_CREATOR_STEP {
  ELEMENTS,
  OPTIONS,
  PREVIEW
}

@Component({
  selector: 'app-form-creator',
  templateUrl: './form-creator.component.html',
  styleUrls: ['./form-creator.component.scss'],
  // tslint:disable-next-line:no-host-metadata-property
  host: {
    class: 'side-nav-wrapper',
  },
})
export class FormCreatorComponent implements OnInit {

  public elementsLibraryConfig: (SectionConfig & {draggingDisabled: boolean, included: boolean})[] = [
    {
      id: 'headers',
      types: ['header'],
      multiple: environment.customization.multipleHeader,
      showSort: environment.customization.multipleHeader,
      draggingDisabled: false,
      included: true
    },
    {
      id: 'treatments',
      types: ['treatment'],
      multiple: true,
      showSort: true,
      draggingDisabled: false,
      included: true
    },
    {
      id: 'footers',
      types: ['footer'],
      multiple: environment.customization.multipleFooter,
      showSort: environment.customization.multipleFooter,
      draggingDisabled: false,
      included: true
    },
  ];

  public selectedElements: {[id: string]: ModelEntry[]} = {
    headers: [],
    treatments: [],
    footers: []
  };

  public themesLibraryConfig: SectionConfig[] = [
    {
      id: 'themes',
      types: ['theme'],
      multiple: true,
      showSort: true
    }
  ];

  public selectedTheme: {[id: string]: ModelEntry[]} = {themes: []};

  public form: FormArray;
  public readonly STEPS = FORM_CREATOR_STEP;
  public readonly ORIENTATIONS = CONSENT_FORM_ORIENTATIONS;
  public readonly RECEIPT_TYPES = RECEIPT_DELIVERY_TYPES;
  public readonly LANGUAGES = LANGUAGES;
  public readonly VALIDITY_UNITS = ['D', 'W', 'M', 'Y'];

  public formUrl: SafeResourceUrl;
  private previousContext: ConsentContext;

  constructor(private consentsResource: ConsentsResourceService,
              private modelsResource: ModelsResourceService,
              private fb: FormBuilder,
              private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    zip(...this.elementsLibraryConfig.map(c => this.modelsResource.listEntries({types: c.types, size: 1}))).pipe(
      tap((responses) => {
        const selected: {[id: string]: ModelEntry[]} = {...this.selectedElements};
        responses.forEach((response, index) => {
          if (response.totalCount === 1) {
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
        header: ['', [Validators.required, Validators.pattern(FIELD_VALIDATORS.key.pattern)]],
        elements: [[], [Validators.required, Validators.pattern(FIELD_VALIDATORS.elementsKeys.pattern)]],
        footer: ['', [Validators.pattern(FIELD_VALIDATORS.key.pattern)]]
      }),
      this.fb.group({
        subject: ['', [Validators.required]],
        orientation: [ConsentFormOrientation.VERTICAL, [Validators.required]],
        validity: [6, [Validators.min(1)]],
        validityUnit: ['M'],
        receiptDeliveryType: ['DISPLAY'],
        locale: ['', [Validators.required]],
        forceDisplay: [true, [Validators.required]],
        optoutEmail: [''],
        preview: [true, [Validators.required]]
      }),
      this.fb.group({
        theme: ['', [Validators.pattern(FIELD_VALIDATORS.key.pattern)]]
      })
    ]);
  }

  elementDropped(event: CdkDragDrop<ModelEntry[]>): void {
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

  selectedElementsChange(event: {[id: string]: ModelEntry[]}): void {
    this.setSelectedElements(event);
  }

  selectedThemeChange(event: {[id: string]: ModelEntry[]}): void {
    this.setSelectedTheme(event);
  }

  preview(): void {
    if (this.form.invalid) {
      return;
    }
    this.form.disable();
    const formValue: Partial<ConsentContext & {forceDisplay: boolean, validityUnit: string}> = {
      ...this.form.at(FORM_CREATOR_STEP.OPTIONS).value,
      ...this.form.at(FORM_CREATOR_STEP.ELEMENTS).value,
      ...this.form.at(FORM_CREATOR_STEP.PREVIEW).value
    };
    const context: ConsentContext = {
      owner: '', // géré côté backend
      subject: formValue.subject,
      orientation: formValue.orientation,
      header: formValue.header,
      elements: formValue.elements,
      footer: formValue.footer,
      callback: '',
      validity: formValue.validity ? `P${formValue.validity}${formValue.validityUnit}` : '',
      locale: formValue.locale,
      formType: formValue.forceDisplay ? ConsentFormType.FULL : ConsentFormType.PARTIAL,
      receiptDeliveryType: formValue.receiptDeliveryType,
      userinfos: {},
      attributes: {},
      optoutEmail: formValue.optoutEmail,
      collectionMethod: CollectionMethod.WEBFORM,
      author: '',
      preview: formValue.preview,
      iframe: true,
      theme: formValue.theme
    };
    if (context === this.previousContext) {
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
    if (event.selectedIndex === FORM_CREATOR_STEP.PREVIEW) {
      this.preview();
    }
  }

  includedChange(): void {
    // Set selected elements to take into account included state
    this.setSelectedElements(this.selectedElements);
  }

  private setSelectedElements(selected: {[id: string]: ModelEntry[]}): void {
    this.selectedElements = selected;
    const footerIncluded = this.elementsLibraryConfig.find(c => c.id === 'footers').included;
    this.form.at(FORM_CREATOR_STEP.ELEMENTS).setValue({
      header: this.selectedElements.headers.map(e => e.key)?.[0] || '',
      elements: this.selectedElements.treatments.map(e => e.key),
      footer: footerIncluded ? this.selectedElements.footers.map(e => e.key)?.[0] || '' : ''
    });
  }

  private setSelectedTheme(selected: {[id: string]: ModelEntry[]}): void {
    this.selectedTheme = selected;
    this.form.at(FORM_CREATOR_STEP.PREVIEW).setValue({
      theme: this.selectedTheme.themes?.[0]?.key || ''
    });
    this.preview();
  }

}
