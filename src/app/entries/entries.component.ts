import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { EntryEditorDialogComponent, EntryEditorDialogComponentData } from '../entry-editor-dialog/entry-editor-dialog.component';
import { MODEL_DATA_TYPES, ModelEntry, ModelFilter } from '../models';
import { ModelsResourceService } from '../models-resource.service';
import { Router } from '@angular/router';
import { MatSort, Sort } from '@angular/material/sort';

class ConsentElementEntryDataSource implements DataSource<ModelEntry> {

  private entriesSubject = new BehaviorSubject<ModelEntry[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  public loading$ = this.loadingSubject.asObservable();

  private _paginator: MatPaginator;

  constructor(private modelsResourceService: ModelsResourceService) {
  }

  get paginator(): MatPaginator | null {
    return this._paginator;
  }

  set paginator(paginator: MatPaginator | null) {
    this._paginator = paginator;
  }

  connect(collectionViewer: CollectionViewer): Observable<ModelEntry[] | ReadonlyArray<ModelEntry>> {
    return this.entriesSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.entriesSubject.complete();
    this.loadingSubject.complete();
  }

  loadEntries(filter: ModelFilter): void {
    this.loadingSubject.next(true);
    this.modelsResourceService.listEntries(filter).pipe(
      finalize(() => this.loadingSubject.next(false))
    ).subscribe(response => {
      if (this._paginator != null) {
        this._paginator.length = response.totalCount;
      }
      this.entriesSubject.next(response.values);
    }, error => {
      console.error(error);
      this.entriesSubject.next([]);
    });
  }

}

@Component({
  selector: 'app-entries',
  templateUrl: './entries.component.html',
  styleUrls: ['./entries.component.scss']
})
export class EntriesComponent implements OnInit {

  displayedColumns = ['key', 'name', 'type', 'id', 'actions'];

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

  constructor(private modelsResourceService: ModelsResourceService, private dialog: MatDialog, private router: Router) {
    // MODEL_DATA_TYPES.forEach((type: ModelDataType) => {
    //   [1, 2, 3, 4, 5, 6, 7, 8, 9].forEach(index => {
    //     this.modelsResourceService.createEntry({
    //       type,
    //       key: `test-${type}-${index}`,
    //       name: `Test ${type}`,
    //       description: 'This is a test'
    //     }).subscribe(x => {
    //       console.log(x);
    //     });
    //   });
    // });
  }

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
    this.dataSource.loadEntries(this.filter);
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
        this.router.navigate(['entries', entry.id]);
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
