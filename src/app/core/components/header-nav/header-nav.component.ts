import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { Router } from '@angular/router';
import { debounceTime, mergeMap } from 'rxjs/operators';
import { SubjectsResourceService } from '../../http/subjects-resource.service';
import { FormControl } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { SubjectDto } from '../../models/models';
import { I18N_LANGUAGES } from '../../constants/i18n';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { environment } from '../../../../environments/environment';

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

  constructor(
    public keycloak: KeycloakService,
    private router: Router,
    private subjectsService: SubjectsResourceService,
    private dialog: MatDialog,
    public translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.searchCtrl = new FormControl();
    this.filteredSubjects = this.searchCtrl.valueChanges.pipe(
      debounceTime(200),
      mergeMap((value: string) => {
        if (value.length > 1) {
          return this.subjectsService.listSubjects(value);
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
    return this.keycloak.isUserInRole('admin') ? '/admin/home' : '/user/me';
  }
}
