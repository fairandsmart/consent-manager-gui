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
import { Component, Input, OnInit } from '@angular/core';
import { StatsChart } from '../../../../../core/models/models';

interface TopRow {
  rank: number;
  collectedKey: string;
  collectedValue: number;
  acceptedKey: string;
  acceptedValue: number;
}

@Component({
  selector: 'cm-dashboard-top-table',
  templateUrl: './dashboard-top-table.component.html',
  styleUrls: ['./dashboard-top-table.component.scss']
})
export class DashboardTopTableComponent implements OnInit {

  @Input()
  public stats: StatsChart;

  public topTable: TopRow[];

  public displayedColumns = ['rank', 'collectedKey', 'collectedValue', 'acceptedKey', 'acceptedValue'];

  constructor() {
  }

  ngOnInit(): void {
    this.updateTable();
  }

  updateTable(): void {
    if (this.stats) {
      this.topTable = [];
      for (let i = 0; i < this.stats.collected.labels.length; i++) {
        this.topTable.push({
          rank: i + 1,
          collectedKey: this.stats.collected.labels[i],
          collectedValue: this.stats.collected.datasets[0].data[i],
          acceptedKey: this.stats.accepted.labels[i],
          acceptedValue: this.stats.accepted.datasets[0].data[i]
        });
      }
    }
  }

}
