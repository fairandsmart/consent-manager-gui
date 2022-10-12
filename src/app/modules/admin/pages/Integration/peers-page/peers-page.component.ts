/*-
 * #%L
 * Right Consents, a Universal Consents & Preferences Management Platform.
 * %%
 * Copyright (C) 2020 - 2021 Fair And Smart
 * %%
 * This file is part of Right Consents Community Edition.
 *
 * Right Consents Community Edition is published by FAIR AND SMART under the
 * GNU GENERAL PUBLIC LICENCE Version 3 (GPLv3) and a set of additional terms.
 *
 * For more information, please see the “LICENSE” and “LICENSE.FAIRANDSMART”
 * files, or see https://www.fairandsmart.com/opensource/.
 * #L%
 */
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { PeersDataSource } from './peers-datasource';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AlertService } from '../../../../../core/services/alert.service';
import { Icons } from '../../../../../core/models/common';
import { createPeer, CreatePeerDto, deletePeer, Peer } from '@fairandsmart/consents-ce/peers';

@Component({
  selector: 'cm-peers-page',
  templateUrl: './peers-page.component.html',
  styleUrls: ['./peers-page.component.scss']
})
export class PeersPageComponent implements OnInit, AfterViewInit {

  public displayedColumns: string[] = ['name', 'url', 'apiKey', 'actions'];

  public dataSource: PeersDataSource;

  public form: FormGroup;

  readonly ICONS = Icons;

  readonly URL_PATTERN = '^https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&\\/=]*)$';

  constructor(
    private dialog: MatDialog,
    private alertService: AlertService,
    private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.dataSource = new PeersDataSource();
    this.loadPeers();
    this.form = this.fb.group({
      url: ['', [Validators.required]],
      apiKey: [undefined, [Validators.required]]
    });
  }

  ngAfterViewInit(): void {
    this.loadPeers();
  }

  loadPeers(): void {
    this.dataSource.load();
  }

  dropPeer(peer: Peer): void {
    this.alertService.confirm({
      data: {
        title: 'API.PEERS.DROP.CONFIRM_TITLE',
        content: 'API.PEERS.DROP.CONFIRM_CONTENT',
        confirm: 'API.PEERS.DROP.CONFIRM_BUTTON'
      }
    }).afterClosed().subscribe(confirmed => {
      if (confirmed) {
        deletePeer(peer.id).subscribe(() => {
          this.alertService.success('API.PEERS.DROP.SUCCESS');
          this.loadPeers();
        });
      }
    });
  }

  generatePeer(): void {
    if (this.form.valid) {
      this.form.disable();
      const peerDto: CreatePeerDto = {
        url: this.form.get('url').value,
        apiKey: this.form.get('apiKey').value,
        withCounterPart: true,
      };
      createPeer(peerDto).subscribe(() => {
        this.loadPeers();
        this.form.enable();
        this.form.reset();
      });
    }
  }

}
