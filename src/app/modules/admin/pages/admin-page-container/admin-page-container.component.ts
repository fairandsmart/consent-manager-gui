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
import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { MatSidenav } from '@angular/material/sidenav';
import { SideNavComponent } from '../../components/side-nav/side-nav.component';

@Component({
  selector: 'cm-admin-page',
  templateUrl: './admin-page-container.component.html',
  styleUrls: ['./admin-page-container.component.scss']
})
export class AdminPageContainerComponent implements OnInit {

  @ViewChild('matSidenav', {static: true})
  matSidenav: MatSidenav;
  @ViewChild('sidenav', {static: true})
  sidenav: SideNavComponent;
  sidenavMode$: Observable<'over' | 'push' | 'side'>;

  constructor(
    private breakpointObserver: BreakpointObserver
  ) { }

  ngOnInit(): void {
    this.sidenavMode$ = this.breakpointObserver.observe([Breakpoints.XSmall]).pipe(
      map((state) => {
        if (state.matches) {
          if (this.matSidenav && this.matSidenav.opened) {
            this.matSidenav.close();
          }
          return 'over';
        } else {
          if (this.matSidenav && !this.matSidenav.opened) {
            this.matSidenav.open();
          }
          return 'side';
        }
      })
    );
  }

}
