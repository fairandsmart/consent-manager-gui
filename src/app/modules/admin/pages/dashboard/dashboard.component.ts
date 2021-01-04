import { Component, OnInit, ViewChild } from '@angular/core';
import { StatsChart } from '../../../../core/models/models';
import { StatisticsResourceService } from '../../../../core/http/statistics-resource.service';
import { DashboardChartComponent } from '../../components/dashboard/dashboard-chart/dashboard-chart.component';
import { DashboardTopTableComponent } from '../../components/dashboard/dashboard-top-table/dashboard-top-table.component';
import { DashboardNumbersComponent } from '../../components/dashboard/dashboard-numbers/dashboard-numbers.component';

@Component({
  selector: 'cm-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  readonly CHART_COLORS_SET: Array<any> = [
    {
      backgroundColor: '#44bad6',
      borderColor: '#44bad6',
      pointBackgroundColor: '#44bad6',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#44bad6'
    }, {
      backgroundColor: '#eab91a',
      borderColor: '#eab91a',
      pointBackgroundColor: '#eab91a',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#eab91a'
    }, {
      backgroundColor: '#e7551d',
      borderColor: '#e7551d',
      pointBackgroundColor: '#e7551d',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#e7551d'
    }, {
      backgroundColor: '#52c513',
      borderColor: '#52c513',
      pointBackgroundColor: '#52c513',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#52c513'
    }, {
      backgroundColor: '#6c6c6c',
      borderColor: '#6c6c6c',
      pointBackgroundColor: '#6c6c6c',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#6c6c6c'
    }, {
      backgroundColor: '#bebebe',
      borderColor: '#bebebe',
      pointBackgroundColor: '#bebebe',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#bebebe'
    }, {
      backgroundColor: '#d31313',
      borderColor: '#d31313',
      pointBackgroundColor: '#d31313',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#d31313'
    }
  ];

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
    },
    lineChart: {
      chartType: 'line',
      elements: {
        line: {
          tension: 0,
          fill: false
        }
      },
      legend: {
        display: false
      },
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

  @ViewChild('recordsChart')
  public recordsChart: DashboardChartComponent;
  public recordsStats: StatsChart;

  @ViewChild('subjectsChart')
  public subjectsChart: DashboardChartComponent;
  public subjectsStats: StatsChart;

  @ViewChild('totalCard')
  public totalCard: DashboardNumbersComponent;
  public totalStats: StatsChart;

  @ViewChild('topTable')
  public topTable: DashboardTopTableComponent;
  public topStats: StatsChart;

  constructor(public statsService: StatisticsResourceService) {
  }

  ngOnInit(): void {
    this.statsService.getStats().subscribe(stats => {
      this.recordsStats = stats.records;
      this.subjectsStats = stats.subjects;
      this.totalStats = stats.total;
      this.topStats = stats.top;
      this.updateCharts();
    });
  }

  updateCharts(): void {
    if (this.recordsChart) {
      this.recordsChart.updateChart();
    }
    if (this.subjectsChart) {
      this.subjectsChart.updateChart();
    }
    if (this.totalCard) {
      this.totalCard.updateCard();
    }
    if (this.topTable) {
      this.topTable.updateTable();
    }
  }

}
