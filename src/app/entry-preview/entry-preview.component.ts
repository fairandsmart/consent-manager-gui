import { Component, Input, OnInit } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-entry-preview',
  templateUrl: './entry-preview.component.html',
  styleUrls: ['./entry-preview.component.scss']
})
export class EntryPreviewComponent implements OnInit {

  @Input()
  locale: string = environment.customization.defaultLocale;

  @Input()
  safePreview: SafeHtml;

  constructor() { }

  ngOnInit(): void {
  }

}
