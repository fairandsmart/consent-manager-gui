import { AfterViewInit, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { KeysResourceService } from '../keys-resource.service';
import { Key } from '../models';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, filter, skip, takeUntil } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from '../services/alert.service';

class KeysDataSource implements DataSource<Key> {

  private valuesSubject = new BehaviorSubject<Key[]>(null);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  public loading$ = this.loadingSubject.asObservable();

  constructor(private keysResource: KeysResourceService) {
  }

  connect(collectionViewer: CollectionViewer): Observable<Key[] | ReadonlyArray<Key>> {
    return this.valuesSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.valuesSubject.complete();
    this.loadingSubject.complete();
  }

  load(): void {
    this.loadingSubject.next(true);
    this.keysResource.listKeys().pipe(
      takeUntil(this.loading$.pipe(
        skip(1),
        // Aborts request if loadPage() called up again before completion of previous
        filter(loading => loading),
      )),
      catchError(err => {
        console.error(err);
        return of([] as Key[]);
      })
    ).subscribe(response => {
      this.loadingSubject.next(false);
      this.valuesSubject.next(response);
    });
  }

}

@Component({
  selector: 'app-keys',
  templateUrl: './keys.component.html',
  styleUrls: ['./keys.component.scss']
})
export class KeysComponent implements OnInit, AfterViewInit {

  public displayedColumns: string[] = ['name', 'key', 'creationDate', 'lastAccessDate', 'actions'];

  public dataSource: KeysDataSource;

  public form: FormGroup;

  constructor(
    private keysResource: KeysResourceService,
    private dialog: MatDialog,
    protected ref: ChangeDetectorRef,
    private fb: FormBuilder) {}

  ngOnInit(): void {
    this.dataSource = new KeysDataSource(this.keysResource);
    this.loadKeys();
    this.form = this.fb.group({
      name: ['', [Validators.required]]
    });
  }

  ngAfterViewInit(): void {
    this.loadKeys();
  }

  loadKeys(): void {
    this.dataSource.load();
  }

  dropKey(key: Key): void {
    console.log("Dropping key " + key.id);
    this.keysResource.deleteKey(key.id).subscribe(
      response => {
          this.loadKeys();
      });
  }

  generateKey(): void {
    console.log("Generating new key for name " + this.form.get('name').value);
    //this.keysResource.createKey(this.form.get('name').value).subscribe(
    //  response => {
    //    this.dialog.open(GeneratedKeyDialog, { data: response });
    //    this.loadKeys();
    //  }
    //)
  }

}

@Component({
  selector: 'generated-key-dialog',
  templateUrl: 'generated-key-dialog.html',
})
export class GeneratedKeyDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: Key) {}
}
