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
import { ActivatedRoute, Router } from '@angular/router';

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

  private defaultForm = {
    keyword: '',
    statuses: [ModelEntryStatus.ACTIVE, ModelEntryStatus.INACTIVE],
    languages: [this.configService.getDefaultLanguage(), '']
  };

  get isDefault(): boolean {
    return Object.keys(this.form.getRawValue())
      .every((field) => JSON.stringify(this.form.get(field).value) === JSON.stringify(this.defaultForm[field]));
  }

  constructor(protected configService: ConfigService, private fb: FormBuilder, private router: Router, private route: ActivatedRoute) {
    this.defaultLanguage = this.configService.getDefaultLanguage();
  }

  ngOnInit(): void {
    // If a pre-set filter configuration is present, apply it (e.g. in the collect form page)
    this.form = this.fb.group({
      keyword: [this.section.filter.keyword ? this.section.filter.keyword : this.defaultForm.keyword],
      statuses: [this.section.filter.statuses ? this.section.filter.statuses : this.defaultForm.statuses],
      languages: [this.section.filter.languages ? this.section.filter.languages : this.defaultForm.languages]
    });
    // Then set the pre-set filter as "default" for this page. Allows the "reset" button to behave properly
    this.defaultForm = this.form.getRawValue();
    this.applyFilters();

    if (this.section.persistFilters) {
      // If the section is set to keep filters through navigation, set persistFilters to true.
      this.route.queryParams.subscribe((params) => {
        if (params.keyword) {
          this.form.get('keyword').setValue(params.keyword);
        }
        if (params.statuses) {
          this.form.get('statuses').setValue(params.statuses.split(','));
        }
        if (params.languages) {
          this.form.get('languages').setValue(params.languages.split(','));
        }
        this.applyFilters();
      });
    }
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
    if (this.section.persistFilters) {
      if (!this.isDefault) {
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: { keyword: data.keyword, statuses: data.statuses.join(','), languages: data.languages.join(',') }
        });
      } else {
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: {}
        });
      }
    }
    this.form.enable();
  }

  resetFilters(): void {
    this.form = this.fb.group({
      keyword: [this.defaultForm.keyword],
      statuses: [this.defaultForm.statuses],
      languages: [this.defaultForm.languages]
    });
    this.applyFilters();
  }

}
