import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EntryRecord, OperatorLogElement, PreferenceValueType } from '../../../../../core/models/models';

export interface SubjectRecordEditorDialogData {
  record: EntryRecord;
  valueType?: PreferenceValueType;
  options: string[];
}

@Component({
  selector: 'cm-subject-record-editor-dialog',
  templateUrl: './subject-record-editor-dialog.component.html',
  styleUrls: ['./subject-record-editor-dialog.component.scss']
})
export class SubjectRecordEditorDialogComponent implements OnInit {

  readonly TYPES = PreferenceValueType;

  control: FormControl;

  constructor(private dialogRef: MatDialogRef<SubjectRecordEditorDialogComponent, OperatorLogElement>,
              @Inject(MAT_DIALOG_DATA) public data: SubjectRecordEditorDialogData) {
  }

  ngOnInit(): void {
    const state = this.parseValue();
    this.control = new FormControl(state);
  }

  parseValue(): any {
    switch (this.data.valueType) {
      case PreferenceValueType.LIST_MULTI:
      case PreferenceValueType.CHECKBOXES:
        return this.data.record.value?.split(',') ?? [];
      case PreferenceValueType.FREE_TEXT:
      case PreferenceValueType.RADIO_BUTTONS:
      case PreferenceValueType.LIST_SINGLE:
      case PreferenceValueType.TOGGLE:
      default:
        return this.data.record.value;
    }
  }

  serializeValue(): string {
    switch (this.data.valueType) {
      case PreferenceValueType.LIST_MULTI:
      case PreferenceValueType.CHECKBOXES:
        return this.control.value.join(',');
      case PreferenceValueType.FREE_TEXT:
      case PreferenceValueType.RADIO_BUTTONS:
      case PreferenceValueType.LIST_SINGLE:
      case PreferenceValueType.TOGGLE:
      default:
        return this.control.value;
    }
  }

  isMultipleChoice(): boolean {
    return this.data.valueType === this.TYPES.CHECKBOXES || this.data.valueType === this.TYPES.LIST_MULTI;
  }

  submit(): void {
    this.dialogRef.close({
      type: this.data.record.type,
      key: this.data.record.key,
      identifier: this.data.record.identifier,
      value: this.serializeValue()
    });
  }
}
