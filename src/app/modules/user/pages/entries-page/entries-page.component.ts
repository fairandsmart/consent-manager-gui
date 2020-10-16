import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'cm-entries-page',
  templateUrl: './entries-page.component.html',
  styleUrls: ['./entries-page.component.scss']
})
export class EntriesPageComponent implements OnInit {

  public elementsKeys: string[];

  constructor() { }

  ngOnInit(): void {
    this.elementsKeys = environment.customization.userPageElementsOrder.split(',');
  }

}
