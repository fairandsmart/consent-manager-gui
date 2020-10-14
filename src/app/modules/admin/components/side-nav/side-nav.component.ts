import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

interface SideNavSection {
  title: string;
  link?: string;
  expanded?: boolean;
  sub?: SideNavSubSection[];
  subActive?: boolean;
}

interface SideNavSubSection {
  title: string;
  link: string;
}

@Component({
  selector: 'cm-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss']
})
export class SideNavComponent implements OnInit {

  SECTIONS: SideNavSection[] = [
    {
      title: 'NAV.CATEGORIES.HOME.LABEL',
      link: '/admin/home'
    },
    {
      title: 'NAV.CATEGORIES.MODELS.LABEL',
      link: '/admin/config',
      expanded: false,
      sub: [
        {
          title: 'NAV.CATEGORIES.MODELS.INFO',
          link: '/admin/config/basicinfo'
        },
        {
          title: 'NAV.CATEGORIES.MODELS.TREATMENTS',
          link: '/admin/config/treatments'
        },
        {
          title: 'NAV.CATEGORIES.MODELS.PREFERENCES',
          link: '/admin/config/preferences'
        },
        {
          title: 'NAV.CATEGORIES.MODELS.CONDITIONS',
          link: '/admin/config/conditions'
        },
        {
          title: 'NAV.CATEGORIES.MODELS.EMAILS',
          link: '/admin/config/emails'
        },
        {
          title: 'NAV.CATEGORIES.MODELS.THEMES',
          link: '/admin/config/themes'
        },
      ]
    },
    {
      title: 'NAV.CATEGORIES.INTEGRATION.LABEL',
      expanded: false,
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

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.SECTIONS.forEach(s => {
      if (s.sub?.some(sub => this.router.isActive(sub.link, false))) {
        s.expanded = true;
        s.subActive = true;
      }
    });
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe(() => {
      this.SECTIONS.forEach(s => {
        if (s.sub?.some(sub => this.router.isActive(sub.link, false))) {
          s.subActive = true;
        } else {
          s.subActive = false;
        }
      });
    });
  }

}
