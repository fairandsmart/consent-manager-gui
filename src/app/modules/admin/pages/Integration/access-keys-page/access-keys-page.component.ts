import { AfterViewInit, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Icons, Key } from '../../../../../core/models/models';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { KeysResourceService } from '../../../../../core/http/keys-resource.service';
import { AlertService } from '../../../../../core/services/alert.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {TranslateService} from '@ngx-translate/core';
import {KeysDataSource} from './keys-datasource';

@Component({
  selector: 'cm-keys',
  templateUrl: './access-keys-page.component.html',
  styleUrls: ['./access-keys-page.component.scss']
})
export class AccessKeysPageComponent implements OnInit, AfterViewInit {

  public displayedColumns: string[] = ['name', 'creationDate', 'lastAccessDate', 'actions'];

  public dataSource: KeysDataSource;

  public form: FormGroup;

  readonly ICONS = Icons;

  constructor(
    private keysResource: KeysResourceService,
    private dialog: MatDialog,
    private alertService: AlertService,
    private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.dataSource = new KeysDataSource(this.keysResource);
    this.loadKeys();
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(25)]]
    });
  }

  ngAfterViewInit(): void {
    this.loadKeys();
  }

  loadKeys(): void {
    this.dataSource.load();
  }

  dropKey(key: Key): void {
    this.alertService.confirm({
      data: {
        title: 'API.KEYS.DROP.CONFIRM_TITLE',
        content: 'API.KEYS.DROP.CONFIRM_CONTENT',
        confirm: 'API.KEYS.DROP.CONFIRM_BUTTON'
      }
    }).afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.keysResource.deleteKey(key.id).subscribe(() => {
          this.alertService.success('API.KEYS.DROP.SUCCESS');
          this.loadKeys();
        });
      }
    });
  }

  generateKey(): void {
    if (this.form.valid) {
      this.form.disable();
      const name = this.form.get('name').value;
      this.keysResource.createKey(name).subscribe(response => {
        this.dialog.open(GeneratedKeyDialogComponent, {data: response});
        this.loadKeys();
        this.form.enable();
        this.form.reset({name: ''});
      });
    }
  }

}

@Component({
  selector: 'cm-generated-key-dialog',
  templateUrl: 'generated-key-dialog.html',
  styleUrls: ['./generated-key-dialog.scss']
})
export class GeneratedKeyDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: Key, public toaster: MatSnackBar, public translate: TranslateService) {
  }

  copied(): void {
    this.toaster.open(this.translate.instant('COMMON.ACTIONS.COPIED'));
  }
}
