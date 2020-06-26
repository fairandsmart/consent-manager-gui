import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Footer } from '../models';
import { ModelsResourceService } from '../models-resource.service';
import { EntryContentDirective } from '../entry-content/entry-content.directive';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LANGUAGES } from '../common/constants';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['../entry-content/_entry-content.directive.scss', './footer.component.scss']
})
export class FooterComponent extends EntryContentDirective<Footer> implements OnInit {

  readonly LANGUAGES = LANGUAGES;

  constructor(private fb: FormBuilder, modelsResourceService: ModelsResourceService, snackBar: MatSnackBar) {
    super(modelsResourceService, snackBar);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  protected initForm(): void {
    this.form = this.fb.group({
      type: ['footer', [Validators.required]],
      locale: ['', [Validators.required]],
      body: ['', [Validators.required]],
      showAcceptAll: [false],
      customAcceptAllText: ['']
    });
  }

}
