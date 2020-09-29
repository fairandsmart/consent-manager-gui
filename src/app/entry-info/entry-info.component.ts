import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EntryEditorDialogComponent, EntryEditorDialogComponentData } from '../entry-editor-dialog/entry-editor-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ModelEntryDto, ModelVersionDto, ModelVersionDtoLight } from '../models';

@Component({
  selector: 'app-entry-info',
  templateUrl: './entry-info.component.html',
  styleUrls: ['./entry-info.component.scss']
})
export class EntryInfoComponent implements OnInit {

  @Input()
  entry: ModelEntryDto;

  @Input()
  version: ModelVersionDto;

  @Output()
  selectVersion = new EventEmitter<ModelVersionDtoLight>();

  @Input()
  showType = true;

  constructor(private dialog: MatDialog) {
  }

  ngOnInit(): void {
  }

  edit(): void {
    this.dialog.open<EntryEditorDialogComponent, EntryEditorDialogComponentData>(EntryEditorDialogComponent, {
      data: {entry: this.entry}
    }).afterClosed().subscribe((updatedEntry) => {
      if (updatedEntry != null) {
        this.entry = updatedEntry;
      }
    });
  }

  versionIndex(): number {
    return this.entry.versions.findIndex(v => v.id === this.version.id) + 1;
  }

}
