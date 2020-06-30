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
import { MatChipsModule } from '@angular/material/chips';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class MatPaginatorIntlFr extends MatPaginatorIntl {

  private rangeLabel: string;

  constructor(private translateService: TranslateService) {
    super();
    this.translateService.onLangChange.subscribe(() => this.getTranslations());
  }

  getTranslations() {
    this.translateService.get([
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

  getRangeLabel = ((page, pageSize, length) => {
    if (length === 0 || pageSize === 0) {
      return `0 ${this.rangeLabel} ${length}`;
    }
    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
    return `${startIndex + 1} - ${endIndex} ${this.rangeLabel} ${length}`;
  });

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
  DragDropModule
];

@NgModule({
  imports: [...modules],
  exports: [...modules],
  providers: [{provide: MatPaginatorIntl, useClass: MatPaginatorIntlFr}]
})
export class MaterialModule {
}
