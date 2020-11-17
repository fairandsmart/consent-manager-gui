import { Component, OnInit } from '@angular/core';
import { Icons } from '../../../../core/models/models';

@Component({
  selector: 'cm-getting-started-page',
  templateUrl: './getting-started-page.component.html',
  styleUrls: ['./getting-started-page.component.scss']
})
export class GettingStartedPageComponent implements OnInit {

  readonly ICONS = Icons;

  constructor() { }

  ngOnInit(): void {
  }

}
