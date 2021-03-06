/*-
 * #%L
 * Right Consents, a Universal Consents & Preferences Management Platform.
 * %%
 * Copyright (C) 2020 - 2021 Fair And Smart
 * %%
 * This file is part of Right Consents Community Edition.
 * 
 * Right Consents Community Edition is published by FAIR AND SMART under the
 * GNU GENERAL PUBLIC LICENCE Version 3 (GPLv3) and a set of additional terms.
 * 
 * For more information, please see the “LICENSE” and “LICENSE.FAIRANDSMART”
 * files, or see https://www.fairandsmart.com/opensource/.
 * #L%
 */
import { Injectable, NgModule } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { TranslateService } from '@ngx-translate/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatRippleModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatStepperModule } from '@angular/material/stepper';
import { MatRadioModule } from '@angular/material/radio';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

@Injectable()
export class MatPaginatorIntlTranslated extends MatPaginatorIntl {

  private rangeLabel = 'of';

  constructor(private translate: TranslateService) {
    super();
    this.translate.onLangChange.subscribe(() => this.getTranslations());
    this.getTranslations();
  }

  getRangeLabel = ((page, pageSize, length) => {
    if (length === 0 || pageSize === 0) {
      return `0 ${this.rangeLabel} ${length}`;
    }
    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
    return `${startIndex + 1} - ${endIndex} ${this.rangeLabel} ${length}`;
  });

  getTranslations(): void {
    this.translate.get([
      'MATERIAL.PAGINATOR.FIRST_PAGE',
      'MATERIAL.PAGINATOR.LAST_PAGE',
      'MATERIAL.PAGINATOR.ITEMS_PER_PAGE',
      'MATERIAL.PAGINATOR.NEXT_PAGE',
      'MATERIAL.PAGINATOR.PREVIOUS_PAGE',
      'MATERIAL.PAGINATOR.RANGE'
    ])
      .subscribe(translation => {
        this.firstPageLabel = translation['MATERIAL.PAGINATOR.FIRST_PAGE'];
        this.lastPageLabel = translation['MATERIAL.PAGINATOR.LAST_PAGE'];
        this.itemsPerPageLabel = translation['MATERIAL.PAGINATOR.ITEMS_PER_PAGE'];
        this.nextPageLabel = translation['MATERIAL.PAGINATOR.NEXT_PAGE'];
        this.previousPageLabel = translation['MATERIAL.PAGINATOR.PREVIOUS_PAGE'];
        this.rangeLabel = translation['MATERIAL.PAGINATOR.RANGE'];
        this.changes.next();
      });
  }

}

const modules = [
  MatButtonModule,
  MatMenuModule,
  MatToolbarModule,
  MatTableModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatDividerModule,
  MatDialogModule,
  MatIconModule,
  MatCardModule,
  MatCheckboxModule,
  MatSnackBarModule,
  MatSortModule,
  MatAutocompleteModule,
  DragDropModule,
  MatExpansionModule,
  MatGridListModule,
  MatRippleModule,
  MatProgressSpinnerModule,
  MatTooltipModule,
  MatSidenavModule,
  MatListModule,
  MatSlideToggleModule,
  MatStepperModule,
  MatRadioModule,
  MatTabsModule,
  MatChipsModule,
  MatButtonToggleModule
];

@NgModule({
  imports: [...modules],
  exports: [...modules],
  providers: [{provide: MatPaginatorIntl, useClass: MatPaginatorIntlTranslated}]
})
export class MaterialModule {
}
