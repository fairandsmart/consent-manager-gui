import { AfterViewInit, ChangeDetectionStrategy, Component, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { EntryEditorDialogComponent, EntryEditorDialogComponentData } from '../entry-editor-dialog/entry-editor-dialog.component';
import { CollectionPage, ModelDataType, ModelEntry, ModelFilter } from '../models';
import { ModelsResourceService } from '../models-resource.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CollectionDatasource } from '../common/collection-datasource';

export class ConsentElementEntryDataSource extends CollectionDatasource<ModelEntry, ModelFilter> {

  constructor(private modelsResource: ModelsResourceService) {
    super();
  }

  protected getPage(pageFilter: ModelFilter): Observable<CollectionPage<ModelEntry>> {
    return this.modelsResource.listEntries(pageFilter);
  }

}

export interface SectionConfig {
  type: ModelDataType;
  multiple: boolean;
  showSort: boolean;
  filter?: ModelFilter;
  dataSource?: ConsentElementEntryDataSource;
  orderingOptions?: (keyof ModelEntry)[];
}

@Component({
  selector: 'app-entries',
  templateUrl: './entries.component.html',
  styleUrls: ['./entries.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EntriesComponent implements OnInit, AfterViewInit {

  // tslint:disable-next-line:no-input-rename
  @Input('config')
  sections: SectionConfig[];

  @ViewChildren(MatPaginator)
  paginators!: QueryList<MatPaginator>;

  constructor(
      private modelsResource: ModelsResourceService,
      private dialog: MatDialog,
      private route: ActivatedRoute,
      private router: Router) {}

  ngOnInit(): void {
    this.sections.forEach(s => {
      if (s.dataSource == null) {
        s.dataSource = new ConsentElementEntryDataSource(this.modelsResource);
      }
      if (s.orderingOptions == null) {
        s.orderingOptions = ['name', 'key'];
      }
      if (s.filter == null) {
        s.filter = {
          types: [s.type],
          page: 0,
          size: 12,
          order: 'name',
          direction: 'asc'
        };
      }
    });
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
        this.router.navigate(['.', entry.id], {relativeTo: this.route});
      }
    });
  }

}
