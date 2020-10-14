import { Component, OnInit } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

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

  constructor(public keycloak: KeycloakService) { }

  ngOnInit(): void {
  }

}
