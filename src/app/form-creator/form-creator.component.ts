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
import * as _ from 'lodash';
import { BehaviorSubject, Observable, zip } from 'rxjs';
import { CdkDragDrop, copyArrayItem, moveItemInArray } from '@angular/cdk/drag-drop';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { LANGUAGES } from '../common/constants';
import { ConsentsResourceService } from '../consents-resource.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { StepperSelectionEvent } from '@angular/cdk/stepper';

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

  public entriesByType = {
    header: {
      selected: [],
      draggingDisabled: false,
      included: true
    },
    treatment: {
      selected: [],
      draggingDisabled: false,
      included: true
    },
    footer: {
      selected: [],
      draggingDisabled: false,
      included: true
    }
  };

  private selectedByTypeSource: BehaviorSubject<{ [type: string]: ModelEntry[] }>
    = new BehaviorSubject<{ [p: string]: ModelEntry[] }>(null);
  public selectedByType$: Observable<{ [type: string]: ModelEntry[] }> = this.selectedByTypeSource.asObservable();

  public form: FormArray;
  public readonly STEPS = FORM_CREATOR_STEP;
  public readonly ORIENTATIONS = CONSENT_FORM_ORIENTATIONS;
  public readonly RECEIPT_TYPES = RECEIPT_DELIVERY_TYPES;
  public readonly LANGUAGES = LANGUAGES;

  public formUrl: SafeResourceUrl;
  private previousContext: ConsentContext;

  public themes: ModelEntry[];

  constructor(private consentsResource: ConsentsResourceService,
              private modelsResource: ModelsResourceService,
              private fb: FormBuilder,
              private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    const types: ModelDataType[] = ['header', 'treatment', 'footer'];
    zip(...types.map(t => this.modelsResource.listEntries({types: [t], size: 1}))).pipe(
      tap((responses) => {
        responses.forEach((response, index) => {
          if (response.totalCount === 1) {
            const type: ModelDataType = types[index];
            this.entriesByType[type].selected = response.values;
            this.entriesByType[type].draggingDisabled = true;
          }
        });
        this.refreshSelectedByType();
      })
    ).subscribe();
    this.modelsResource.listEntries({types: ['theme']}).subscribe((response) => {
      this.themes = response.values;
    });
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
        preview: [true, [Validators.required]],
        theme: ['', [Validators.pattern(FIELD_VALIDATORS.key.pattern)]]
      })
    ]);
  }

  drop(event: CdkDragDrop<ModelEntry[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      copyArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
    this.refreshSelectedByType();
    this.syncFormValuesForEntries();
  }

  droppedOut(): void {
    this.refreshSelectedByType();
    this.syncFormValuesForEntries();
  }

  preview(): void {
    this.form.disable();
    const formValue: Partial<ConsentContext & {forceDisplay: boolean}> = {
      ...this.form.at(FORM_CREATOR_STEP.OPTIONS).value,
      ...this.form.at(FORM_CREATOR_STEP.ELEMENTS).value
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

  private refreshSelectedByType(): void {
    this.selectedByTypeSource.next(_.mapValues(this.entriesByType, 'selected'));
  }

  private syncFormValuesForEntries(): void {
    this.form.at(FORM_CREATOR_STEP.ELEMENTS).setValue({
      header: this.entriesByType.header.selected.map(e => e.key)?.[0] || '',
      elements: this.entriesByType.treatment.selected.map(e => e.key),
      footer: this.entriesByType.footer.selected.map(e => e.key)?.[0] || ''
    });
  }

}
