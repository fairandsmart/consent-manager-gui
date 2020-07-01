import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { EntryEditorDialogComponent, EntryEditorDialogComponentData } from '../entry-editor-dialog/entry-editor-dialog.component';
import { CollectionPage, ModelDataType, ModelEntry, ModelFilter } from '../models';
import { ModelsResourceService } from '../models-resource.service';
import { Router } from '@angular/router';
import { CollectionDatasource } from '../common/collection-datasource';

class ConsentElementEntryDataSource extends CollectionDatasource<ModelEntry, ModelFilter> {

  constructor(private modelsResourceService: ModelsResourceService) {
    super();
  }

  protected getPage(pageFilter: ModelFilter): Observable<CollectionPage<ModelEntry>> {
    return this.modelsResourceService.listEntries(pageFilter);
  }

}

interface SectionConfig {
  type: ModelDataType;
  canAddMultiple: boolean;
  showSort: boolean;
  dataSource: ConsentElementEntryDataSource;
  filter: ModelFilter;
}

@Component({
  selector: 'app-entries',
  templateUrl: './entries.component.html',
  styleUrls: ['./entries.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EntriesComponent implements OnInit, AfterViewInit {

  sections: SectionConfig[] = [
    {
      type: 'header',
      canAddMultiple: false,
      showSort: false,
      dataSource: new ConsentElementEntryDataSource(this.modelsResourceService),
      filter: {
        types: ['header'],
        page: 0,
        size: 12
      }
    },
    {
      type: 'treatment',
      canAddMultiple: true,
      showSort: true,
      dataSource: new ConsentElementEntryDataSource(this.modelsResourceService),
      filter: {
        types: ['treatment'],
        page: 0,
        size: 12,
        order: 'name',
        direction: 'asc'
      }
    },
    {
      type: 'footer',
      canAddMultiple: false,
      showSort: false,
      dataSource: new ConsentElementEntryDataSource(this.modelsResourceService),
      filter: {
        types: ['footer'],
        page: 0,
        size: 12
      }
    },
  ];

  @ViewChildren(MatPaginator)
  paginators!: QueryList<MatPaginator>;

  constructor(
      private modelsResourceService: ModelsResourceService,
      private dialog: MatDialog,
      private router: Router) {}

  ngOnInit(): void {
    this.loadEntriesPage();
  }

  ngAfterViewInit(): void {
    this.paginators.forEach((paginator, index) => {
      paginator.pageSize = this.sections[index].filter.size;
      this.sections[index].dataSource.paginator = paginator;
      paginator.page.pipe(
        tap((e) => {
          this.sections[index].filter.size = e.pageSize;
          this.sections[index].filter.page = e.pageIndex;
          this.loadEntriesPage(index);
        })
      ).subscribe();
    });
  }

  loadEntriesPage(index?: number): void {
    if (index != null) {
      this.sections[index].dataSource.loadPage(this.sections[index].filter);
    } else {
      this.sections.forEach(c => c.dataSource.loadPage(c.filter));
    }
  }

  sortBy(order: keyof ModelEntry, config: SectionConfig) {
    config.filter.order = order;
    this.loadEntriesPage(this.sections.indexOf(config));
  }

  toggleDirection(config: SectionConfig) {
    config.filter.direction = config.filter.direction === 'asc' ? 'desc' : 'asc';
    this.loadEntriesPage(this.sections.indexOf(config));
  }

  newEntry(type: ModelDataType): void {
    this.dialog.open<EntryEditorDialogComponent, EntryEditorDialogComponentData>(EntryEditorDialogComponent, {
      data: {entry: {type}}
    }).afterClosed().subscribe((entry) => {
      if (entry != null) {
        this.router.navigate(['config/entries', entry.id]);
      }
    });
  }

}
