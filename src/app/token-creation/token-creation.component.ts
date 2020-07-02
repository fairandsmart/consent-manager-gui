import { Component, OnInit } from '@angular/core';
import {
  CollectionMethod,
  ConsentContext,
  ConsentFormOrientation,
  ConsentFormType,
  FIELD_VALIDATORS,
  MODEL_DATA_TYPES,
  ModelEntry,
  RECEIPT_DELIVERY_TYPES
} from '../models';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConsentsResourceService } from '../consents-resource.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { LANGUAGES } from '../common/constants';
import { ModelsResourceService } from '../models-resource.service';
import * as _ from 'lodash';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, mergeMap, startWith, tap } from 'rxjs/operators';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-token-creation',
  templateUrl: './token-creation.component.html',
  styleUrls: ['../entry-content/_entry-content.directive.scss', './token-creation.component.scss']
})
export class TokenCreationComponent implements OnInit {

  readonly TYPES = RECEIPT_DELIVERY_TYPES;
  readonly LANGUAGES = LANGUAGES;

  public form: FormGroup;
  public formUrl: SafeResourceUrl;
  public token = '';

  public entriesByTypeSource: BehaviorSubject<{ [type: string]: ModelEntry[] }> = new BehaviorSubject<{[p: string]: ModelEntry[]}>({});
  public entriesByType$: Observable<{ [type: string]: ModelEntry[] }> = this.entriesByTypeSource.asObservable();
  public optionsByType: {[type: string]: Observable<ModelEntry[]>} = {};

  availableTreatments = [];

  displayedTreatments = [];

  constructor(private consentsResource: ConsentsResourceService,
              private modelsResource: ModelsResourceService,
              private fb: FormBuilder,
              private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.modelsResource.listEntries({types: MODEL_DATA_TYPES, page: 0, size: 100}).pipe(
      map((response) => _.groupBy(response.values, 'type')),
      tap((entriesByType) => {
        this.availableTreatments = entriesByType.treatment;
      })
    ).subscribe(x => this.entriesByTypeSource.next(x));
    this.form = this.fb.group({
      subject: ['', [
        Validators.required
      ]],
      vertical: [true, [
        Validators.required
      ]],
      headerKey: ['', [
        Validators.required,
        Validators.pattern(FIELD_VALIDATORS.key.pattern)
      ]],
      elementsKeys: [[], [
        Validators.required,
        Validators.pattern(FIELD_VALIDATORS.elementsKeys.pattern)
      ]],
      footerKey: ['', [
        Validators.required,
        Validators.pattern(FIELD_VALIDATORS.key.pattern)
      ]],
      validity: ['', []],
      receiptType: ['', [
        Validators.required
      ]],
      locale: ['', [
        Validators.required
      ]],
      forceDisplay: [true, [
        Validators.required
      ]],
      optoutEmail: ['', [
        Validators.required
      ]],
      preview: [true, [
        Validators.required
      ]]
    });
    this.form.enable();
    [['header', 'headerKey'], ['footer', 'footerKey']].forEach(([type, controlName]) => {
      this.optionsByType[type] = this.form.get(controlName).valueChanges.pipe(
        startWith(''),
        mergeMap((inputValue) => {
          return this.entriesByType$.pipe(
            map((entriesByType) => {
              if (entriesByType[type] != null) {
                return entriesByType[type].filter(e => e.key.startsWith(inputValue));
              }
              return [];
            })
          );
        })
      );
    });
  }

  drop(event: CdkDragDrop<ModelEntry[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
    this.form.get('elementsKeys').setValue(this.displayedTreatments.map(entry => entry.key));
  }

  addTreatment(treatment: ModelEntry) {
    const currentIndex = this.availableTreatments.filter(t => t.key === treatment.key).findIndex(t => t === treatment);
    transferArrayItem(this.availableTreatments,
      this.displayedTreatments,
      currentIndex,
      this.displayedTreatments.length);
    this.form.get('elementsKeys').setValue(this.displayedTreatments.map(entry => entry.key));
  }

  removeTreatment(treatment: ModelEntry) {
    const currentIndex = this.displayedTreatments.filter(t => t.key === treatment.key).findIndex(t => t === treatment);
    transferArrayItem(this.displayedTreatments,
      this.availableTreatments,
      currentIndex,
      this.availableTreatments.length);
    this.form.get('elementsKeys').setValue(this.displayedTreatments.map(entry => entry.key));
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.form.disable();
    const formValue = this.form.getRawValue();
    const context: ConsentContext = {
      owner: '', // géré côté backend
      subject: formValue.subject,
      orientation: formValue.vertical ? ConsentFormOrientation.VERTICAL : ConsentFormOrientation.HORIZONTAL,
      header: formValue.headerKey,
      elements: formValue.elementsKeys,
      footer: formValue.footerKey,
      callback: '',
      validity: formValue.validity,
      locale: formValue.locale,
      formType: formValue.forceDisplay ? ConsentFormType.FULL : ConsentFormType.PARTIAL,
      receiptDeliveryType: formValue.receiptType,
      userinfos: {},
      attributes: {},
      optoutEmail: formValue.optoutEmail,
      collectionMethod: CollectionMethod.WEBFORM,
      author: '',
      preview: formValue.preview,
      iframe: true
    };
    this.consentsResource.generateToken(context).subscribe((token) => {
      this.token = token;
      this.formUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.consentsResource.getFormUrl(this.token));
      this.form.enable();
    }, (err) => {
      console.error(err);
      this.form.enable();
      this.token = '';
      this.formUrl = '';
    });
  }

}
