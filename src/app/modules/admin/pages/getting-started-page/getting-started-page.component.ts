import { Component, OnInit } from '@angular/core';
import { Icons } from '../../../../core/models/models';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'cm-getting-started-page',
  templateUrl: './getting-started-page.component.html',
  styleUrls: ['./getting-started-page.component.scss']
})
export class GettingStartedPageComponent implements OnInit {

  readonly ICONS = Icons;

  sectionName: string;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.parent.url.subscribe((section) => {
      this.sectionName = section[0].path;
    });
  }

}
