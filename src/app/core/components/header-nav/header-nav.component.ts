import { Component, Input, OnInit } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { NavigationEnd, Router } from '@angular/router';
import { debounceTime, filter, mergeMap } from 'rxjs/operators';
import { SubjectsResourceService } from '../../http/subjects-resource.service';
import { FormControl } from '@angular/forms';
import { Observable, of } from 'rxjs';

export interface NavSection {
  title: string;
  link?: string;
  sub?: SideNavSubSection[];
}

export interface SideNavSubSection {
  title: string;
  link: string;
}

@Component({
  selector: 'cm-header-nav',
  templateUrl: './header-nav.component.html',
  styleUrls: ['./header-nav.component.scss']
})
export class HeaderNavComponent implements OnInit {

  @Input()
  displaySections = false;

  @Input()
  displaySearchBar = false;

  readonly SECTIONS: NavSection[] = [
    {
      title: 'NAV.CATEGORIES.HOME.LABEL',
      link: '/admin/home'
    },
    {
      title: 'NAV.CATEGORIES.MODELS.LABEL',
      sub: [
        {
          title: 'NAV.CATEGORIES.MODELS.INFO',
          link: '/admin/configuration/basicinfo'
        },
        {
          title: 'NAV.CATEGORIES.MODELS.PROCESSING',
          link: '/admin/configuration/processing'
        },
        {
          title: 'NAV.CATEGORIES.MODELS.PREFERENCES',
          link: '/admin/configuration/preferences'
        },
        {
          title: 'NAV.CATEGORIES.MODELS.CONDITIONS',
          link: '/admin/configuration/conditions'
        },
        {
          title: 'NAV.CATEGORIES.MODELS.EMAILS',
          link: '/admin/configuration/emails'
        },
        {
          title: 'NAV.CATEGORIES.MODELS.THEMES',
          link: '/admin/configuration/themes'
        },
      ]
    },
    {
      title: 'NAV.CATEGORIES.INTEGRATION.LABEL',
      sub: [
        {
          title: 'NAV.CATEGORIES.INTEGRATION.FORM_CREATOR',
          link: '/admin/integration/form-creator'
        },
        {
          title: 'NAV.CATEGORIES.INTEGRATION.API',
          link: '/admin/integration/api'
        },
      ]
    }
  ];

  active: NavSection;

  searchCtrl: FormControl;

  filteredSubjects: Observable<string[]>;

  constructor(
    public keycloak: KeycloakService,
    private router: Router,
    private subjectsService: SubjectsResourceService,
  ) { }

  ngOnInit(): void {
    this.SECTIONS.some(s => {
      if (
        (!s.sub && this.router.isActive(s.link, true)) ||
        s.sub?.some(sub => this.router.isActive(sub.link, false))
      ) {
        this.active = s;
        return true;
      }
    });
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe(() => {
      const hasActive = this.SECTIONS.some(s => {
        if (
          (!s.sub && this.router.isActive(s.link, true)) ||
          s.sub?.some(sub => this.router.isActive(sub.link, false))
        ) {
          this.active = s;
          return true;
        }
      });
      if (!hasActive) {
        this.active = null;
      }
    });
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

  search(): void {
    const subject = this.searchCtrl.value?.trim();
    if (subject != null) {
      this.router.navigate(['admin', 'subjects', subject]);
      this.searchCtrl.reset('');
    }
  }

}
