import { Component, OnInit } from '@angular/core';
import { ModelsResourceService } from '../../../../../core/http/models-resource.service';
import { Observable } from 'rxjs';
import { ExtractionConfigDto, ExtractionResultDto, Icons, ModelEntryDto, Preference } from '../../../../../core/models/models';
import { map, tap } from 'rxjs/operators';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RecordsResourceService } from '../../../../../core/http/records-resource.service';
import { environment } from '../../../../../../environments/environment';
import * as FileSaver from 'file-saver';

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

  private readonly defaultLanguage = environment.customization.defaultLanguage;

  constructor(
    private modelsResource: ModelsResourceService,
    private recordsResource: RecordsResourceService,
    private fb: FormBuilder
  ) { }

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
          this.options$ = this.modelsResource.getActiveVersion<Preference>(entry.id).pipe(
            map((version) => version.data[this.defaultLanguage].options),
            tap((options) => {
              this.emptyOptions = options.length === 0;
            })
          );
          break;
      }
      this.form.markAsPristine();
    });
    this.entries$ = this.modelsResource.listEntries({
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
    this.records$ = this.recordsResource.extractRecords(this.currentConfig);
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
    this.recordsResource.extractRecordsCsv(this.currentConfig).subscribe((csv) => {
      const blob = new Blob([csv], {type: 'text/csv'});
      FileSaver.saveAs(blob, `results.csv`);
    });
  }

}
