import { Component, OnInit, ViewChild } from '@angular/core';
import { CollectionDatasource } from '../common/collection-datasource';
import { CollectionPage, ModelEntry, ModelFilter, ModelDataType } from '../models';
import { ModelsResourceService } from '../models-resource.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { tap } from 'rxjs/operators';
import { EntryEditorDialogComponent, EntryEditorDialogComponentData } from '../entry-editor-dialog/entry-editor-dialog.component';

class ThemeEntryDataSource extends CollectionDatasource<ModelEntry, ModelFilter> {

  constructor(private modelsResource: ModelsResourceService) {
    super();
  }

  protected getPage(pageFilter: ModelFilter): Observable<CollectionPage<ModelEntry>> {
    return this.modelsResource.listEntries(pageFilter);
  }

}

@Component({
  selector: 'app-themes',
  templateUrl: './themes.component.html',
  styleUrls: ['./themes.component.scss']
})
export class ThemesComponent implements OnInit {

  dataSource: ThemeEntryDataSource;

  filter: ModelFilter = {
    types: ['theme'],
    page: 0,
    size: 10,
    order: 'name',
    direction: 'asc'
  };

  sortOptions = ['name', 'key', 'targetType'];

  @ViewChild(MatPaginator, {static: true})
  paginator: MatPaginator;

  constructor(
      private modelsResource: ModelsResourceService,
      private dialog: MatDialog,
      private router: Router) {}

  ngOnInit(): void {
    this.dataSource = new ThemeEntryDataSource(this.modelsResource);
    this.dataSource.paginator = this.paginator;
    this.paginator.page.pipe(
      tap((e) => {
        this.filter.size = e.pageSize;
        this.filter.page = e.pageIndex;
        this.loadThemesPage();
      })
    ).subscribe();
    this.loadThemesPage();
  }

  loadThemesPage(): void {
    this.dataSource.loadPage(this.filter);
  }

  newTheme(): void {
    const type: ModelDataType = 'theme';
    this.dialog.open<EntryEditorDialogComponent, EntryEditorDialogComponentData>(EntryEditorDialogComponent, {
      data: {entry: {type}}
    }).afterClosed().subscribe((entry) => {
      if (entry != null) {
        this.router.navigate(['config/themes', entry.id]);
      }
    });
  }

  sortBy(key): void {
    this.filter.order = key;
    this.loadThemesPage();
  }

  toggleDirection(): void {
    this.filter.direction = this.filter.direction === 'asc' ? 'desc' : 'asc';
    this.loadThemesPage();
  }

}
