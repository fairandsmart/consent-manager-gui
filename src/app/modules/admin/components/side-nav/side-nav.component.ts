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
import { Component, OnInit } from '@angular/core';
import { filter } from 'rxjs/operators';
import { NavigationEnd, Router } from '@angular/router';
import { Icons } from '../../../../core/models/common';

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
          title: 'NAV.CATEGORIES.MODELS.GETTING_STARTED',
          link: '/admin/configuration/getting-started',
          icon: Icons.gettingStarted
        },
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
          title: 'NAV.CATEGORIES.INTEGRATION.GETTING_STARTED',
          link: '/admin/integration/getting-started',
          icon: Icons.gettingStarted
        },
        {
          title: 'NAV.CATEGORIES.INTEGRATION.COLLECT',
          link: '/admin/integration/collect',
          icon: Icons.collect
        },
        {
          title: 'NAV.CATEGORIES.INTEGRATION.INTERROGATE',
          link: '/admin/integration/search',
          icon: Icons.interrogate
        },
        {
          title: 'NAV.CATEGORIES.INTEGRATION.SECURITY',
          link: '/admin/integration/security',
          icon: Icons.security
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
