import { Component, OnInit } from '@angular/core';
import { EntryContentDirective } from '../entry-content/entry-content.directive';
import { Header } from '../models';
import { FormBuilder, Validators } from '@angular/forms';
import { ModelsResourceService } from '../models-resource.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LANGUAGES } from '../common/constants';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['../entry-content/_entry-content.directive.scss', './header.component.scss']
})
export class HeaderComponent extends EntryContentDirective<Header> implements OnInit {

  readonly LANGUAGES = LANGUAGES;

  constructor(
      private fb: FormBuilder,
      modelsResourceService: ModelsResourceService,
      snackBar: MatSnackBar,
      translateService: TranslateService) {
    super(modelsResourceService, snackBar, translateService);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  protected initForm(): void {
    this.form = this.fb.group({
      type: ['header', [Validators.required]],
      locale: ['', [Validators.required]],
      logoPath: [''],
      logoAltText: [''],
      title: ['', [Validators.required]],
      body: ['', [Validators.required]],
      jurisdiction: [''],
      showJurisdiction: [false],
      collectionMethod: [''],
      showCollectionMethod: [false],
      dataController: this.fb.group({
        actingBehalfCompany: [false],
        company: [''],
        name: [''],
        address: [''],
        email: [''],
        phoneNumber: ['']
      }),
      showDataController: [false],
      scope: [''],
      showScope: [false],
      shortNoticeLink: [''],
      showShortNoticeLink: [false],
      privacyPolicyUrl: ['', [Validators.required]],
      customPrivacyPolicyText: ['']
    });
  }

}
