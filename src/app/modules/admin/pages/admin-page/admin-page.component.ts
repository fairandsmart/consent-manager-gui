import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { MatSidenav } from '@angular/material/sidenav';
import { SideNavComponent } from '../../components/side-nav/side-nav.component';

@Component({
  selector: 'cm-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.scss']
})
export class AdminPageComponent implements OnInit {

  @ViewChild('matsSidenav', {static: true})
  matsSidenav: MatSidenav;
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
          if (this.matsSidenav && this.matsSidenav.opened) {
            this.matsSidenav.close();
          }
          return 'over';
        } else {
          if (this.matsSidenav && !this.matsSidenav.opened) {
            this.matsSidenav.open();
          }
          return 'side';
        }
      })
    );
  }

}
