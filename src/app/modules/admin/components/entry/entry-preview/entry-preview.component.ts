import { Component, Input, OnInit } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'cm-entry-preview',
  templateUrl: './entry-preview.component.html',
  styleUrls: ['./entry-preview.component.scss']
})
export class EntryPreviewComponent implements OnInit {

  @Input()
  safePreview: SafeHtml;

  constructor() { }

  ngOnInit(): void {
  }

}
