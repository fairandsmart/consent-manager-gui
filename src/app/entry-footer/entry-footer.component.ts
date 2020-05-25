import { Component, Input, OnInit } from '@angular/core';
import { ConsentElementEntry, FooterVersion } from '../consents-resource.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-entry-footer',
  templateUrl: './entry-footer.component.html',
  styleUrls: ['./entry-footer.component.scss']
})
export class EntryFooterComponent implements OnInit {

  @Input()
  entry: ConsentElementEntry;

  @Input()
  entryContent: FooterVersion;

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

  private loadVersion(version: FooterVersion): void {
    this.form.patchValue({
      defaultLocale: version.defaultLocale,
      availableLocales: version.availableLocales
    });
  }

}
