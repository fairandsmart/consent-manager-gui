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
