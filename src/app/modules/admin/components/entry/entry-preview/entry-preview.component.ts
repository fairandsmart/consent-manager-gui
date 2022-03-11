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
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import {
  CONSENT_FORM_ORIENTATIONS,
  FormLayoutOrientation,
  PREVIEW_TYPES,
  PreviewType,
} from '@fairandsmart/consents-ce/models';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'cm-entry-preview',
  templateUrl: './entry-preview.component.html',
  styleUrls: ['./entry-preview.component.scss']
})
export class EntryPreviewComponent implements OnInit {

  readonly PREVIEW_TYPES = PREVIEW_TYPES;
  readonly ORIENTATIONS = CONSENT_FORM_ORIENTATIONS;

  @Input()
  withControls = false;

  @Output()
  refreshPreview: EventEmitter<void> = new EventEmitter<void>();

  safePreview: SafeHtml;
  previewTypeCtrl: FormControl;
  orientationCtrl: FormControl;

  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    if (this.withControls) {
      this.previewTypeCtrl = new FormControl(PreviewType.FORM, [Validators.required]);
      this.orientationCtrl = new FormControl(FormLayoutOrientation.VERTICAL, [Validators.required]);
      this.previewTypeCtrl.valueChanges.subscribe(value => {
        if (value !== PreviewType.FORM) {
          this.orientationCtrl.disable();
          this.orientationCtrl.setValue(FormLayoutOrientation.VERTICAL);
        } else {
          this.orientationCtrl.enable();
        }
        this.refreshPreview.emit();
      });
      this.orientationCtrl.valueChanges.subscribe(() => {
        if (this.orientationCtrl.enabled) {
          this.refreshPreview.emit();
        }
      });
    }
  }

  updateHtml(html: string): void {
    this.safePreview = this.sanitizer.bypassSecurityTrustHtml(html);
  }

}
