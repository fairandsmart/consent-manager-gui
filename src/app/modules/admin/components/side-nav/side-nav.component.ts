import { Component, OnInit } from '@angular/core';
import { Icons } from '../../../../core/models/models';
import { filter } from 'rxjs/operators';
import { NavigationEnd, Router } from '@angular/router';

export interface NavSection {
  title: string;
  link?: string;
  expanded?: boolean;
  sub?: SideNavSubSection[];
}

export interface SideNavSubSection {
  title: string;
  link: string;
  icon?: Icons;
}

@Component({
  selector: 'cm-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss']
})
export class SideNavComponent implements OnInit {

  active: NavSection;

  readonly SECTIONS: NavSection[] = [
    {
      title: 'NAV.CATEGORIES.HOME.LABEL',
      link: '/admin/home'
    },
    {
      title: 'NAV.CATEGORIES.MODELS.LABEL',
      expanded: false,
      sub: [
        {
          title: 'NAV.CATEGORIES.MODELS.INFO',
          link: '/admin/configuration/basicinfo',
          icon: Icons.basicinfo
        },
        {
          title: 'NAV.CATEGORIES.MODELS.PROCESSING',
          link: '/admin/configuration/processing',
          icon: Icons.processing
        },
        {
          title: 'NAV.CATEGORIES.MODELS.PREFERENCES',
          link: '/admin/configuration/preferences',
          icon: Icons.preference
        },
        {
          title: 'NAV.CATEGORIES.MODELS.CONDITIONS',
          link: '/admin/configuration/conditions',
          icon: Icons.conditions
        },
        {
          title: 'NAV.CATEGORIES.MODELS.EMAILS',
          link: '/admin/configuration/emails',
          icon: Icons.email
        },
        {
          title: 'NAV.CATEGORIES.MODELS.THEMES',
          link: '/admin/configuration/themes',
          icon: Icons.theme
        },
      ]
    },
    {
      title: 'NAV.CATEGORIES.INTEGRATION.LABEL',
      expanded: false,
      sub: [
        {
          title: 'NAV.CATEGORIES.INTEGRATION.FORM_CREATOR',
          link: '/admin/integration/form-creator',
          icon: Icons.formCreator
        },
        {
          title: 'NAV.CATEGORIES.INTEGRATION.API',
          link: '/admin/integration/api',
          icon: Icons.apiKey
        },
      ]
    }
  ];

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
    this.SECTIONS.some(s => {
      if (
        (!s.sub && this.router.isActive(s.link, true)) ||
        s.sub?.some(sub => this.router.isActive(sub.link, false))
      ) {
        this.active = s;
        s.expanded = true;
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
  }

  selectMainSection(section: NavSection): void {
    if (section.sub) {
      section.expanded = !section.expanded;
    } else {
      this.SECTIONS.forEach(s => {
        s.expanded = false;
      });
    }
  }

  selectSubSection(section: NavSection): void {
    this.SECTIONS.forEach(s => {
      s.expanded = s === section;
    });
  }

}
