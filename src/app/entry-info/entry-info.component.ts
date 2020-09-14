import { Component, Input, OnInit } from '@angular/core';
import { EntryEditorDialogComponent, EntryEditorDialogComponentData } from '../entry-editor-dialog/entry-editor-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ModelEntryDto } from '../models';

@Component({
  selector: 'app-entry-info',
  templateUrl: './entry-info.component.html',
  styleUrls: ['./entry-info.component.scss']
})
export class EntryInfoComponent implements OnInit {

  @Input()
  entry: ModelEntryDto;

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

}
