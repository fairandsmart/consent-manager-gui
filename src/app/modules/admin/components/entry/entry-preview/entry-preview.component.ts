import { Component, Input, OnInit } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import {
  CONSENT_FORM_ORIENTATIONS,
  PREVIEW_TYPES,
} from '../../../../../core/models/models';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'cm-entry-preview',
  templateUrl: './entry-preview.component.html',
  styleUrls: ['./entry-preview.component.scss']
})
export class EntryPreviewComponent implements OnInit {

  readonly PREVIEW_TYPES = PREVIEW_TYPES;
  readonly ORIENTATIONS = CONSENT_FORM_ORIENTATIONS;

  @Input()
  safePreview: SafeHtml;

  @Input()
  previewTypeCtrl: FormControl;

  @Input()
  orientationCtrl: FormControl;

  constructor() { }

  ngOnInit(): void {
  }

}
