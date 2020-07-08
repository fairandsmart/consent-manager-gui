import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { EntryContentDirective } from '../entry-content/entry-content.directive';
import { Theme, TARGET_TYPES } from '../models';
import { FormBuilder, Validators } from '@angular/forms';
import { ModelsResourceService } from '../models-resource.service';
import { ConsentsResourceService } from '../consents-resource.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LANGUAGES } from '../common/constants';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-theme',
  templateUrl: './theme.component.html',
  styleUrls: ['../entry-content/_entry-content.directive.scss', './theme.component.scss']
})
export class ThemeComponent extends EntryContentDirective<Theme> implements OnInit, AfterViewInit {

  readonly LANGUAGES = LANGUAGES;
  readonly TARGET_TYPES = TARGET_TYPES;

  private rawPreview: string;

  @ViewChild('preview')
  private iframe: ElementRef;

  constructor(
      private fb: FormBuilder,
      modelsResourceService: ModelsResourceService,
      private consentsResourceService: ConsentsResourceService,
      snackBar: MatSnackBar,
      translateService: TranslateService) {
    super(modelsResourceService, snackBar, translateService);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  ngAfterViewInit(): void {
    this.consentsResourceService.getPreviewForm().subscribe((content) => {
      this.rawPreview = content.split('/assets/').join(`${environment.managerUrl}/assets/`);
      this.updatePreview();
    });
  }

  protected initForm(): void {
    this.form = this.fb.group({
      type: ['theme', [Validators.required]],
      locale: ['', [Validators.required]],
      name: ['', [Validators.required]],
      presentation: [''],
      targetType: ['', [Validators.required]],
      icon: [''],
      css: ['', [Validators.required]]
    });
  }

  updatePreview(): void {
    let result = this.rawPreview;
    const style = this.form.get('css');
    if (style && style.value) {
      const headIndex = result.indexOf('</head>');
      result = result.substring(0, headIndex) + `<style>${style.value}</style>` + result.substring(headIndex);
    }
    this.iframe.nativeElement.contentDocument.body.innerHTML = result;
  }
}
