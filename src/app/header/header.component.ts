import { Component, OnInit } from '@angular/core';
import { EntryContentDirective } from '../entry-content/entry-content.directive';
import { Header } from '../models';
import { FormBuilder, Validators } from '@angular/forms';
import { ModelsResourceService } from '../models-resource.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['../entry-content/_entry-content.directive.scss', './header.component.scss']
})
export class HeaderComponent extends EntryContentDirective<Header> implements OnInit {

  constructor(private fb: FormBuilder, modelsResourceService: ModelsResourceService) {
    super(modelsResourceService);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  protected initForm(): void {
    this.form = this.fb.group({
      type: ['header', [Validators.required]],
      logoPath: [''],
      logoAltText: [''],
      title: [''],
      body: [''],
      jurisdiction: [''],
      showJurisdiction: [''],
      collectionMethod: [''],
      showCollectionMethod: [''],
      dataController: this.fb.group({
        actingBehalfCompany: [false],
        company: [''],
        name: [''],
        address: [''],
        email: [''],
        phoneNumber: ['']
      }),
      showDataController: [''],
      scope: [''],
      showScope: [false],
      shortNoticeLink: [''],
      showShortNoticeLink: [''],
      privacyPolicyUrl: [''],
      customPrivacyPolicyText: ['']
    });
  }

}
