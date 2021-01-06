import { Component, Input, OnInit } from '@angular/core';
import { Icons, StatsChart } from '../../../../../core/models/models';

export interface NumberStat {
  icon: string;
  name: string;
  color: string;
  value: number;
  evolution: number;
}

@Component({
  selector: 'cm-dashboard-numbers',
  templateUrl: './dashboard-numbers.component.html',
  styleUrls: ['./dashboard-numbers.component.scss']
})
export class DashboardNumbersComponent implements OnInit {

  @Input()
  public stats: StatsChart;

  @Input()
  public colors;

  public numberStats: NumberStat[];

  constructor() { }

  ngOnInit(): void {
    this.updateCard();
  }

  updateCard(): void {
    if (this.stats) {
      const labels = ['processing', 'preference', 'conditions', 'all'];
      this.numberStats = [];
      labels.forEach((label, index) => {
        this.numberStats.push({
          icon: Icons[label],
          name: label.toUpperCase(),
          color: this.colors[index].backgroundColor,
          value: this.stats.records.datasets.find(d => d.label === label).data[0],
          evolution: this.stats.records.datasets.find(d => d.label === label).data[1]
        });
      });
      this.numberStats.push({
        icon: Icons.subject,
        name: 'SUBJECT',
        color: this.colors[4].backgroundColor,
        value: this.stats.subjects.datasets[0].data[0],
        evolution: this.stats.subjects.datasets[0].data[1]
      });
    }
  }

}