import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { EntryEditorDialogComponent, EntryEditorDialogComponentData } from '../entry-editor-dialog/entry-editor-dialog.component';
import { CollectionPage, MODEL_DATA_TYPES, ModelEntry, ModelFilter } from '../models';
import { ModelsResourceService } from '../models-resource.service';
import { Router } from '@angular/router';
import { MatSort, Sort } from '@angular/material/sort';
import { CollectionDatasource } from '../common/collection-datasource';

class ConsentElementEntryDataSource extends CollectionDatasource<ModelEntry, ModelFilter> {

  constructor(private modelsResourceService: ModelsResourceService) {
    super();
  }

  protected getPage(pageFilter: ModelFilter): Observable<CollectionPage<ModelEntry>> {
    return this.modelsResourceService.listEntries(pageFilter);
  }

}

@Component({
  selector: 'app-entries',
  templateUrl: './entries.component.html',
  styleUrls: ['./entries.component.scss']
})
export class EntriesComponent implements OnInit {

  displayedColumns = ['key', 'name', 'type', 'description', 'actions'];

  pageSizeOptions = [10, 25, 50];

  dataSource: ConsentElementEntryDataSource;

  filter: ModelFilter = {
    types: MODEL_DATA_TYPES,
    page: 0,
    size: 10,
    order: 'name',
    direction: 'asc'
  };

  readonly TYPES = MODEL_DATA_TYPES;

  @ViewChild(MatPaginator, {static: true})
  paginator: MatPaginator;

  @ViewChild(MatSort, {static: true})
  sort: MatSort;

  constructor(
      private modelsResourceService: ModelsResourceService,
      private dialog: MatDialog,
      private router: Router) {}

  ngOnInit(): void {
    this.dataSource = new ConsentElementEntryDataSource(this.modelsResourceService);
    this.dataSource.paginator = this.paginator;
    this.sort.sortChange.subscribe((sort: Sort) => {
      this.filter.page = 0;
      this.filter.order = sort.active;
      this.filter.direction = sort.direction;
      this.loadEntriesPage();
    });
    this.paginator.page.pipe(
      tap((e) => {
        this.filter.size = e.pageSize;
        this.filter.page = e.pageIndex;
        this.loadEntriesPage();
      })
    ).subscribe();
    this.loadEntriesPage();
  }

  loadEntriesPage(): void {
    this.dataSource.loadPage(this.filter);
  }

  filterChange<T extends keyof ModelFilter>(key: T, value: ModelFilter[T]): void {
    this.filter[key] = value;
    this.filter.page = 0;
    this.loadEntriesPage();
  }

  newEntry(): void {
    this.dialog.open<EntryEditorDialogComponent, EntryEditorDialogComponentData>(EntryEditorDialogComponent)
      .afterClosed().subscribe((entry) => {
      if (entry != null) {
        this.router.navigate(['config/entries', entry.id]);
      }
    });
  }

  editEntry(entry: ModelEntry, $event: MouseEvent): void {
    $event.preventDefault();
    $event.stopPropagation();
    this.dialog.open<EntryEditorDialogComponent, EntryEditorDialogComponentData>(EntryEditorDialogComponent, {
      data: {entry}
    }).afterClosed().subscribe((updatedEntry) => {
      if (updatedEntry != null) {
        this.filter.page = 0;
        this.loadEntriesPage();
      }
    });
  }

}
