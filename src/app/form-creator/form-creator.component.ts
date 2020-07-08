import { Component, OnInit } from '@angular/core';
import { ModelsResourceService } from '../models-resource.service';
import {
  CollectionMethod,
  CONSENT_FORM_ORIENTATIONS,
  ConsentContext,
  ConsentFormOrientation,
  ConsentFormType,
  FIELD_VALIDATORS,
  ModelDataType,
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
import { SectionConfig } from '../entries/entries.component';
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

  public elementsConfig: {[type: string]: {
      draggingDisabled: boolean,
      included: boolean
    }} = {
    header: {
      draggingDisabled: false,
      included: true
    },
    treatment: {
      draggingDisabled: false,
      included: true
    },
    footer: {
      draggingDisabled: false,
      included: true
    }
  };

  public selectedElements: {[type: string]: ModelEntry[]} = {
    header: [],
    treatment: [],
    footer: []
  };

  public elementsLibraryConfig: SectionConfig[] = [
    {
      type: 'header',
      multiple: environment.customization.multipleHeader,
      showSort: false
    },
    {
      type: 'treatment',
      multiple: true,
      showSort: true
    },
    {
      type: 'footer',
      multiple: environment.customization.multipleFooter,
      showSort: false
    },
  ];

  public themesLibraryConfig: SectionConfig[] = [
    {
      type: 'theme',
      multiple: true,
      showSort: true
    }
  ];

  public selectedTheme: {[type: string]: ModelEntry[]} = {theme: []};

  public form: FormArray;
  public readonly STEPS = FORM_CREATOR_STEP;
  public readonly ORIENTATIONS = CONSENT_FORM_ORIENTATIONS;
  public readonly RECEIPT_TYPES = RECEIPT_DELIVERY_TYPES;
  public readonly LANGUAGES = LANGUAGES;

  public formUrl: SafeResourceUrl;
  private previousContext: ConsentContext;

  constructor(private consentsResource: ConsentsResourceService,
              private modelsResource: ModelsResourceService,
              private fb: FormBuilder,
              private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    const types: ModelDataType[] = ['header', 'treatment', 'footer'];
    zip(...types.map(t => this.modelsResource.listEntries({types: [t], size: 1}))).pipe(
      tap((responses) => {
        const selected: {[type: string]: ModelEntry[]} = {...this.selectedElements};
        responses.forEach((response, index) => {
          if (response.totalCount === 1) {
            const type: ModelDataType = types[index];
            selected[type] = response.values;
            this.elementsConfig[type].draggingDisabled = true;
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
        validity: [''],
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

  selectedElementsChange(event: {[type: string]: ModelEntry[]}): void {
    this.setSelectedElements(event);
  }

  selectedThemeChange(event: {[type: string]: ModelEntry[]}): void {
    this.setSelectedTheme(event);
  }

  preview(): void {
    this.form.disable();
    const formValue: Partial<ConsentContext & {forceDisplay: boolean}> = {
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
      validity: formValue.validity,
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

  private setSelectedElements(value: {[type: string]: ModelEntry[]}): void {
    this.selectedElements = value;
    this.form.at(FORM_CREATOR_STEP.ELEMENTS).setValue({
      header: this.selectedElements.header.map(e => e.key)?.[0] || '',
      elements: this.selectedElements.treatment.map(e => e.key),
      footer: this.selectedElements.footer.map(e => e.key)?.[0] || ''
    });
  }

  private setSelectedTheme(value: {[type: string]: ModelEntry[]}): void {
    this.selectedTheme = value;
    this.form.at(FORM_CREATOR_STEP.PREVIEW).setValue({
      theme: value.theme?.[0]?.key || ''
    });
    this.preview();
  }

}
