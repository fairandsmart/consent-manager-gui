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
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as FileSaver from 'file-saver';
import { ConfigService } from '../../../../../core/services/config.service';
import { Icons } from '../../../../../core/models/common';
import { getActiveVersion, listEntries, ModelEntryDto, Preference } from '@fairandsmart/consent-manager/models';
import { ExtractionConfigDto, ExtractionResultDto, extractRecords, extractRecordsCsv } from '@fairandsmart/consent-manager/records';

@Component({
  selector: 'cm-interrogate-page',
  templateUrl: './interrogate-page.component.html',
  styleUrls: ['./interrogate-page.component.scss']
})
export class InterrogatePageComponent implements OnInit {

  entries$: Observable<{
    processing: ModelEntryDto[],
    preference: ModelEntryDto[],
    conditions: ModelEntryDto[]
  }>;

  options$: Observable<string[]>;

  records$: Observable<ExtractionResultDto[]>;

  form: FormGroup;

  emptyOptions: boolean;

  private currentConfig: ExtractionConfigDto;

  readonly ICONS = Icons;

  readonly displayedColumns = ['subjectName', 'subjectEmail', 'recordKey', 'recordSerial', 'recordValue'];

  private readonly defaultLanguage;

  constructor(
    private fb: FormBuilder,
    private configService: ConfigService
  ) {
    this.defaultLanguage = this.configService.getDefaultLanguage();
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      entry: [null, Validators.required],
      value: [''],
      values: this.fb.array([''])
    });
    this.form.get('entry').valueChanges.subscribe(entry => {
      switch (entry.type) {
        case 'processing':
        case 'conditions':
          this.form.get('value').setValidators(Validators.required);
          this.form.get('value').setValue('accepted');
          this.getValuesFormArray().clear();
          break;
        case 'preference':
          this.form.get('value').clearValidators();
          this.form.get('value').setValue('');
          this.getValuesFormArray().clear();
          this.addValue();
          this.options$ = getActiveVersion<Preference>(entry.id).pipe(
            map((version) => version.data[this.defaultLanguage].options),
            tap((options) => {
              this.emptyOptions = options.length === 0;
            })
          );
          break;
      }
      this.form.markAsPristine();
    });
    this.entries$ = listEntries({
      size: -1,
      types: ['conditions', 'preference', 'processing'],
      order: 'name'
    }).pipe(
      map((response) => {
        return {
          processing: response.values.filter(e => e.type === 'processing'),
          preference: response.values.filter(e => e.type === 'preference'),
          conditions: response.values.filter(e => e.type === 'conditions'),
        };
      })
    );
  }

  search(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const entry = this.form.get('entry').value as ModelEntryDto;
    let regexpValue: boolean;
    let value: string;
    if (entry.type === 'preference') {
      regexpValue = true;
      const values: string[] = this.emptyOptions ? this.form.get('values').value : this.form.get('values').value[0];
      value = '(^|.*,)('
        + values.filter(x => x.trim().length > 0).join('|')
        + ')(,.*|$)';
    } else {
      regexpValue = false;
      value = this.form.get('value').value;
    }
    this.currentConfig = {
      condition: {
        key: this.form.get('entry').value.key,
        value: value,
        regexpValue: regexpValue
      }
    };
    this.records$ = extractRecords(this.currentConfig);
  }

  getValuesFormArray(): FormArray {
    return this.form.get('values') as FormArray;
  }

  addValue(): void {
    this.getValuesFormArray().push(this.fb.control('', Validators.required));
  }

  removeValue(index: number): void {
    this.getValuesFormArray().removeAt(index);
  }

  exportResults(): void {
    extractRecordsCsv(this.currentConfig).subscribe((csv) => {
      const blob = new Blob([csv], {type: 'text/csv'});
      FileSaver.saveAs(blob, `results.csv`);
    });
  }

}
