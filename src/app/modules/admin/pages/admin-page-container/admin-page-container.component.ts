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
