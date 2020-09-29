import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { KeysResourceService } from '../keys-resource.service';
import { CollectionPage, Key } from '../models';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, filter, skip, takeUntil } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
  selector: 'keys',
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
      name: ['', [
        Validators.required
      ]]
    });
    this.form.enable();
  }

  ngAfterViewInit(): void {
    this.loadKeys();
  }

  loadKeys(): void {
    this.dataSource.load();
  }

  dropKey(key: Key): void {
    console.log("Dropping key " + key.id);
  }

}
