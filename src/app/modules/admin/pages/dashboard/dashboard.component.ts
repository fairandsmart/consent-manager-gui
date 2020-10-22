import { Component, OnInit } from '@angular/core';
import { RecordsResourceService } from '../../../../core/http/records-resource.service';
import { TranslateService } from '@ngx-translate/core';

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
    }];

  public CHART_OPTIONS = {
    stackedChart: {
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
    }
  };

  public numbersData: {[key: string]: number};
  public recordsAverageData: {chartData: object, chartLabels: object};
  public recordsWeekData: {chartData: object, chartLabels: object};
  public answersWeekData: {chartData: object, chartLabels: object};

  constructor(
    public recordsService: RecordsResourceService,
    public translate: TranslateService
  ) {
  }

  ngOnInit(): void {
    this.recordsService.getStats().subscribe((response) => {
      // TODO stats
    const labels = {
      fr: {
        types: ['Traitements', 'Préférences', 'CGU'],
        yes: 'Oui',
        no: 'Non'
      },
      en: {
        types: ['Processing', 'Preferences', 'EULA'],
        yes: 'Yes',
        no: 'No'
      }
    };
    this.numbersData = {
        subjects: 14,
        records: 218
      };
    this.recordsAverageData = {
        chartLabels: labels[this.translate.currentLang].types,
        chartData: [
          {
            data: [5.4, 1.1, 3.2],
            backgroundColor: [
              this.CHART_COLORS_SET[0].backgroundColor,
              this.CHART_COLORS_SET[1].backgroundColor,
              this.CHART_COLORS_SET[2].backgroundColor
            ]
          }
        ]
      };
    this.recordsWeekData = {
        chartLabels: ['21/09', '22/09', '23/09', '24/09', '25/09', '26/09', '27/09'],
        chartData: [
          {
            data: [0, 1, 4, 5, 0, 3, 1],
            label: labels[this.translate.currentLang].types[0]
          },
          {
            data: [3, 2, 0, 1, 4, 0, 2],
            label: labels[this.translate.currentLang].types[1]
          },
          {
            data: [4, 1, 2, 3, 2, 2, 1],
            label: labels[this.translate.currentLang].types[2]
          }
        ]
      };
    this.answersWeekData = {
        chartLabels: ['21/09', '22/09', '23/09', '24/09', '25/09', '26/09', '27/09'],
        chartData: [
          {
            data: [8, 7, 4, 1, 0, 5, 3],
            label: labels[this.translate.currentLang].yes
          },
          {
            data: [3, 5, 2, 3, 4, 1, 2],
            label: labels[this.translate.currentLang].no
          }
        ]
      };
    });
  }

}
