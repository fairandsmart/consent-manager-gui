import { AfterViewInit, ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { ConsentElementEntryDataSource, SectionConfig } from '../entries-library/entries-library.component';
import { tap } from 'rxjs/operators';
import { ModelDataType, ModelEntry } from '../../models';
import { EntryEditorDialogComponent, EntryEditorDialogComponentData } from '../../entry-editor-dialog/entry-editor-dialog.component';
import { MatPaginator } from '@angular/material/paginator';
import { ModelsResourceService } from '../../models-resource.service';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-entries-list',
  templateUrl: './entries-list.component.html',
  styleUrls: ['./entries-list.component.scss']
})
export class EntriesListComponent implements OnInit, AfterViewInit {

  // tslint:disable-next-line:no-input-rename
  @Input('config')
  section: SectionConfig;

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  constructor(
    private modelsResource: ModelsResourceService,
    private dialog: MatDialog,
    protected ref: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router) {}

  ngOnInit(): void {
    if (this.section.dataSource == null) {
      this.section.dataSource = new ConsentElementEntryDataSource(this.modelsResource);
    }
    if (this.section.orderingOptions == null) {
      this.section.orderingOptions = ['name', 'key'];
    }
    if (this.section.filter == null) {
      this.section.filter = {
        types: this.section.types,
        page: 0,
        size: 12,
        order: 'name',
        direction: 'asc'
      };
    }
  }

  ngAfterViewInit(): void {
    this.paginator.pageSize = this.section.filter.size;
    this.section.dataSource.paginator = this.paginator;
    this.paginator.page.pipe(
      tap((e) => {
        this.section.filter.size = e.pageSize;
        this.section.filter.page = e.pageIndex;
        this.loadEntriesPage();
      })
    ).subscribe();
    this.loadEntriesPage();
  }

  loadEntriesPage(): void {
    this.section.dataSource.loadPage(this.section.filter);
  }

  sortBy(order: keyof ModelEntry, config: SectionConfig) {
    config.filter.order = order;
    this.loadEntriesPage();
  }

  toggleDirection(config: SectionConfig) {
    config.filter.direction = config.filter.direction === 'asc' ? 'desc' : 'asc';
    this.loadEntriesPage();
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