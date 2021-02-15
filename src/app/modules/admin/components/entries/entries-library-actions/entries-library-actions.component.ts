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
import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { SectionConfig } from '../entries-library/entries-library.component';
import { ModelEntryDto, ModelEntryStatus } from '@fairandsmart/consent-manager/models';
import { I18N_LANGUAGES } from '../../../../../core/constants/i18n';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ConfigService } from '../../../../../core/services/config.service';
import { MatMenu } from '@angular/material/menu';

@Component({
  selector: 'cm-entries-library-actions',
  templateUrl: './entries-library-actions.component.html',
  styleUrls: ['./entries-library-actions.component.scss']
})
export class EntriesLibraryActionsComponent implements OnInit, AfterViewInit {

  public readonly STATUSES = [ModelEntryStatus.ACTIVE, ModelEntryStatus.INACTIVE];
  public readonly LANGUAGES = I18N_LANGUAGES;
  private readonly defaultLanguage;

  public form: FormGroup;

  // tslint:disable-next-line:no-input-rename
  @Input('config')
  public section: SectionConfig;

  @Output()
  public loadQuery = new EventEmitter<void>();

  @ViewChild('filterMenu')
  public filterMenu: MatMenu;

  constructor(protected configService: ConfigService, private fb: FormBuilder) {
    this.defaultLanguage = this.configService.getDefaultLanguage();
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      keyword: [this.section.filter.keyword ? this.section.filter.keyword : ''],
      statuses: [this.section.filter.statuses ? this.section.filter.statuses : [ModelEntryStatus.ACTIVE, ModelEntryStatus.INACTIVE]],
      languages: [this.section.filter.languages ? this.section.filter.languages : [this.configService.getDefaultLanguage(), '']]
    });
    this.applyFilters();
  }

  ngAfterViewInit(): void {
    this.filterMenu.closed.subscribe(() => {
      if (this.form.dirty) {
        this.applyFilters();
      }
    });
  }

  sortBy(order: keyof ModelEntryDto): void {
    this.section.filter.order = order;
    this.loadQuery.emit();
  }

  toggleDirection(): void {
    this.section.filter.direction = this.section.filter.direction === 'asc' ? 'desc' : 'asc';
    this.loadQuery.emit();
  }

  applyFilters(): void {
    const data = this.form.getRawValue();
    this.form.disable({emitEvent: false});
    this.section.filter.keyword = data.keyword;
    this.section.filter.statuses = data.statuses;
    this.section.filter.languages = data.languages;
    this.loadQuery.emit();
    this.form.markAsPristine();
    this.form.enable();
  }

}
