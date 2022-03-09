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
import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { Router } from '@angular/router';
import { debounceTime, mergeMap } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { I18N_LANGUAGES } from '../../constants/i18n';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { environment } from '../../../../environments/environment';
import { CoreService } from '../../services/core.service';
import { listSubjects, SubjectDto } from '@fairandsmart/consents-ce/subjects';

@Component({
  selector: 'cm-header-nav',
  templateUrl: './header-nav.component.html',
  styleUrls: ['./header-nav.component.scss']
})
export class HeaderNavComponent implements OnInit {

  @Input()
  displaySearchBar = false;

  @Output()
  toggleSideNav = new EventEmitter();

  @ViewChild('searchDialog')
  searchDialogTemplate: TemplateRef<any>;

  private searchDialog: MatDialogRef<any>;

  readonly CUSTOMIZATION = environment.customization;

  searchCtrl: FormControl;

  filteredSubjects: Observable<SubjectDto[]>;

  readonly LANGUAGES = I18N_LANGUAGES;

  @Input() mode: 'admin' | 'user';

  get hasActiveInfo$(): Observable<boolean> {
    return this.coreService.hasActiveInfo$;
  }

  constructor(
    public keycloak: KeycloakService,
    private router: Router,
    private dialog: MatDialog,
    public translate: TranslateService,
    private coreService: CoreService
  ) { }

  ngOnInit(): void {
    this.searchCtrl = new FormControl();
    this.coreService.checkInfo();
    this.filteredSubjects = this.searchCtrl.valueChanges.pipe(
      debounceTime(200),
      mergeMap((value: string) => {
        if (value.length > 1) {
          return listSubjects(value);
        }
        return of([]);
      })
    );
  }

  openSearchDialog(): void {
    this.searchDialog = this.dialog.open(this.searchDialogTemplate, {
      width: '400px'
    });
  }

  search(): void {
    const subject = this.searchCtrl.value?.trim();
    if (subject != null) {
      this.router.navigate(['admin', 'subjects', subject]);
      this.searchCtrl.reset('');
      if (this.searchDialog != null) {
        this.searchDialog.close();
      }
    }
  }

  getHomeUrl(): string {
    return this.keycloak.isUserInRole('admin') || this.keycloak.isUserInRole('operator') ? '/admin/home' : '/user';
  }
}
