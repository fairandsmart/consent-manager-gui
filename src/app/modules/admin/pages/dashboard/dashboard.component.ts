import { Component, OnInit, ViewChild } from '@angular/core';
import { StatsChart } from '../../../../core/models/models';
import { StatisticsResourceService } from '../../../../core/http/statistics-resource.service';
import { DashboardChartComponent } from '../../components/dashboard/dashboard-chart/dashboard-chart.component';
import { DashboardTopTableComponent } from '../../components/dashboard/dashboard-top-table/dashboard-top-table.component';

@Component({
  selector: 'cm-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public CHART_OPTIONS = {
    pie: {
      chartType: 'pie',
      responsive: true
    },
    stackedChart: {
      chartType: 'bar',
      responsive: true,
      scales: {
        xAxes: [{
          stacked: true
        }],
        yAxes: [{
          ticks: {
            beginAtZero: true,
            stepSize: 1
          },
          stacked: true
        }]
      }
    },
    unstackedChart: {
      chartType: 'bar',
      responsive: true,
      scales: {
        xAxes: [{
          stacked: false
        }],
        yAxes: [{
          ticks: {
            beginAtZero: true,
            stepSize: 1
          },
          stacked: false
        }]
      }
    }
  };

  public labelsTranslations;

  @ViewChild('modelsChart')
  public modelsChart: DashboardChartComponent;
  public modelsStats: StatsChart;

  @ViewChild('recordsWebformChart')
  public recordsWebformChart: DashboardChartComponent;
  public recordsWebformStats: StatsChart;

  @ViewChild('recordsOperatorChart')
  public recordsOperatorChart: DashboardChartComponent;
  public recordsOperatorStats: StatsChart;

  @ViewChild('subjectsChart')
  public subjectsChart: DashboardChartComponent;
  public subjectsStats: StatsChart;

  @ViewChild('totalChart')
  public totalChart: DashboardChartComponent;
  public totalStats: StatsChart;

  @ViewChild('topTable')
  public topTable: DashboardTopTableComponent;
  public topStats: StatsChart;

  constructor(public statsService: StatisticsResourceService) {
  }

  ngOnInit(): void {
    this.statsService.getStats().subscribe(stats => {
      this.modelsStats = stats.models;
      this.recordsWebformStats = stats.recordsWebform;
      this.recordsOperatorStats = stats.recordsOperator;
      this.subjectsStats = stats.subjects;
      this.totalStats = stats.total;
      this.topStats = stats.top;
      this.updateCharts();
    });
  }

  updateCharts(): void {
    if (this.modelsChart) {
      this.modelsChart.updateChart();
    }
    if (this.recordsWebformChart) {
      this.recordsWebformChart.updateChart();
    }
    if (this.recordsOperatorChart) {
      this.recordsOperatorChart.updateChart();
    }
    if (this.subjectsChart) {
      this.subjectsChart.updateChart();
    }
    if (this.totalChart) {
      this.totalChart.updateChart();
    }
    if (this.topTable) {
      this.topTable.updateTable();
    }
  }

}
