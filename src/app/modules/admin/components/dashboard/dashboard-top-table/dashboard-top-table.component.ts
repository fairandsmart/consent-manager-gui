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
