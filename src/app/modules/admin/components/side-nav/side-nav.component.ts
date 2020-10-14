import { Component, Input, OnInit } from '@angular/core';
import { NavSection } from '../../../../core/components/header-nav/header-nav.component';

@Component({
  selector: 'cm-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss']
})
export class SideNavComponent implements OnInit {

  @Input()
  section: NavSection;

  constructor() { }

  ngOnInit(): void {
  }

}
