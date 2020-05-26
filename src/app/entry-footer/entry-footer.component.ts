import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Footer, ModelEntry, ModelVersion } from '../models';

@Component({
  selector: 'app-entry-footer',
  templateUrl: './entry-footer.component.html',
  styleUrls: ['./entry-footer.component.scss']
})
export class EntryFooterComponent implements OnInit {

  @Input()
  entry: ModelEntry;

  @Input()
  entryContent: ModelVersion<Footer>;

  form: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      defaultLocale: ['', [Validators.required]],
      availableLocales: [''],
    });
    if (this.entryContent) {
      this.loadVersion(this.entryContent);
    }
  }

  private loadVersion(version: ModelVersion<Footer>): void {
    this.form.patchValue({
      defaultLocale: version.defaultLocale,
      availableLocales: version.availableLocales
    });
  }

}
