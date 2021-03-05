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
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ModelEntryDto, ModelVersionDto, ModelVersionDtoLight } from '@fairandsmart/consent-manager/models';
import { MatSidenav } from '@angular/material/sidenav';
import { Observable } from 'rxjs';
import { EntryPreviewComponent } from '../entry-preview/entry-preview.component';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';

@Component({
  selector: 'cm-entry-editor-container',
  templateUrl: './entry-editor-container.component.html',
  styleUrls: ['../entry-content/_entry-content.directive.scss']
})
export class EntryEditorContainerComponent implements OnInit {

  @Input()
  entry: ModelEntryDto;

  @Input()
  version: ModelVersionDto;

  @Input()
  displayActions = true;

  @Input()
  disableSave = true;

  @Input()
  disableActivate = true;

  @Input()
  disableDelete = true;

  @Input()
  withPreviewControl = false;

  @Output()
  saveVersion: EventEmitter<void> = new EventEmitter<void>();

  @Output()
  activateVersion: EventEmitter<void> = new EventEmitter<void>();

  @Output()
  deleteDraft: EventEmitter<void> = new EventEmitter<void>();

  @Output()
  refreshPreview: EventEmitter<void> = new EventEmitter<void>();

  @Output()
  selectVersion: EventEmitter<ModelVersionDtoLight> = new EventEmitter<ModelVersionDtoLight>();

  @ViewChild('optionsNav', {static: true})
  sidenav: MatSidenav;
  sideNavBehavior$: Observable<'side' | 'over'>;

  @ViewChild('preview')
  preview: EntryPreviewComponent;

  constructor(
    protected breakpointObserver: BreakpointObserver
  ) { }

  ngOnInit(): void {
    this.sideNavBehavior$ = this.breakpointObserver.observe([Breakpoints.Small, Breakpoints.XSmall]).pipe(
      map((state) => {
        if (state.matches) {
          if (this.sidenav && this.sidenav.opened) {
            this.sidenav.close();
          }
          return 'over';
        } else {
          if (this.sidenav && !this.sidenav.opened) {
            this.sidenav.open();
          }
          return 'side';
        }
      })
    );
  }

}
