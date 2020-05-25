import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import {
  CONSENT_ELEMENT_DATA_TYPES,
  ConsentElementDataType,
  ConsentElementEntry,
  ConsentElementEntryFilter,
  ConsentsResourceService,
  Footer,
  Header
} from '../consents-resource.service';
import { MatPaginator } from '@angular/material/paginator';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, Observable } from 'rxjs';
import { delay, finalize, tap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { EntryEditorDialogComponent, EntryEditorDialogComponentData } from '../entry-editor-dialog/entry-editor-dialog.component';

class ConsentElementEntryDataSource implements DataSource<ConsentElementEntry> {

  private entriesSubject = new BehaviorSubject<ConsentElementEntry[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  public loading$ = this.loadingSubject.asObservable();

  private _paginator: MatPaginator;

  constructor(private consentsResource: ConsentsResourceService) {
  }

  get paginator(): MatPaginator | null {
    return this._paginator;
  }

  set paginator(paginator: MatPaginator | null) {
    this._paginator = paginator;
  }

  connect(collectionViewer: CollectionViewer): Observable<ConsentElementEntry[] | ReadonlyArray<ConsentElementEntry>> {
    return this.entriesSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.entriesSubject.complete();
    this.loadingSubject.complete();
  }

  loadEntries(filter: ConsentElementEntryFilter): void {
    this.loadingSubject.next(true);
    this.consentsResource.listEntries(filter).pipe(
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
export class EntriesComponent implements OnInit, AfterViewInit {

  displayedColumns = ['key', 'name', 'type', 'id', 'actions'];

  pageSizeOptions = [10, 25, 50];

  dataSource: ConsentElementEntryDataSource;

  filter: ConsentElementEntryFilter = {
    types: CONSENT_ELEMENT_DATA_TYPES,
    page: 0,
    size: 10
  };

  @ViewChild(MatPaginator, {static: true})
  paginator: MatPaginator;

  constructor(private consentsResource: ConsentsResourceService, private dialog: MatDialog) {
    // CONSENT_ELEMENT_DATA_TYPES.forEach((type: ConsentElementDataType) => {
    //   [1, 2, 3, 4, 5, 6, 7, 8, 9].forEach(index => {
    //     this.consentsResource.createEntry({
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
    this.dataSource = new ConsentElementEntryDataSource(this.consentsResource);
    this.dataSource.paginator = this.paginator;
    this.paginator.page.pipe(
      tap((e) => {
        this.filter.size = e.pageSize;
        this.filter.page = e.pageIndex;
        this.loadEntriesPage();
      })
    ).subscribe();
    this.loadEntriesPage();
  }

  ngAfterViewInit() {
  }

  loadEntriesPage(): void {
    this.dataSource.loadEntries(this.filter);
  }

  newEntry(): void {
    this.dialog.open<EntryEditorDialogComponent, EntryEditorDialogComponentData>(EntryEditorDialogComponent)
      .afterClosed().subscribe((entry) => {
      if (entry != null) {
        this.filter.page = 0;
        this.loadEntriesPage();
      }
    });
  }

  editEntry(entry: ConsentElementEntry, $event: MouseEvent): void {
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
