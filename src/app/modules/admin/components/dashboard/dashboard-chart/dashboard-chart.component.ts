import { Component, Input, OnInit } from '@angular/core';
import { StatsChart, StatsData, TIME_SCALES, TimeScale } from '../../../../../core/models/models';
import { FormControl } from '@angular/forms';
import * as _ from 'lodash';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'cm-dashboard-chart',
  templateUrl: './dashboard-chart.component.html',
  styleUrls: ['./dashboard-chart.component.scss']
})
export class DashboardChartComponent implements OnInit {

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

  public readonly TIME_SCALES = TIME_SCALES;

  @Input()
  public name;

  @Input()
  private labelsTranslations;

  @Input()
  public stats: StatsChart;
  public control: FormControl;
  public currentStats: StatsData;

  @Input()
  public chartOptions;

  constructor(public translate: TranslateService) {
  }

  ngOnInit(): void {
    this.control = new FormControl(TimeScale.MONTHS);
    this.control.valueChanges.subscribe(() => this.updateChart());
    this.translate.onLangChange.subscribe(() => this.updateTranslations());
    this.updateTranslations();
  }

  updateTranslations(): void {
    this.translate.get([
      'COMMON.ENTRY_TYPES.PROCESSING',
      'COMMON.ENTRY_TYPES.PREFERENCE',
      'COMMON.ENTRY_TYPES.CONDITIONS',
      'DASHBOARD.LABELS.SUBJECTS',
      'DASHBOARD.WEEKS_PREFIX',
      ..._.range(1, 8).map(i => 'DASHBOARD.DAYS.' + i),
      ..._.range(1, 13).map(i => 'DASHBOARD.MONTHS.' + i)
  ]).
    subscribe(translations => {
      this.labelsTranslations = {
        processing: translations['COMMON.ENTRY_TYPES.PROCESSING'],
        preference: translations['COMMON.ENTRY_TYPES.PREFERENCE'],
        conditions: translations['COMMON.ENTRY_TYPES.CONDITIONS'],
        subjects: translations['DASHBOARD.LABELS.SUBJECTS'],
        weeksPrefix: translations['DASHBOARD.WEEKS_PREFIX'],
        DAYS: _.range(1, 8).map(i => translations['DASHBOARD.DAYS.' + i]),
        MONTHS: _.range(1, 13).map(i => translations['DASHBOARD.MONTHS.' + i])
      };
      this.updateChart();
    });
  }

  updateChart(): void {
    if (this.stats && this.labelsTranslations) {
      this.currentStats = _.cloneDeep(this.stats[this.control.value]);
      this.currentStats.labels = this.currentStats.labels
        // tslint:disable-next-line:radix
        .map(label => this.formatDateLabel(this.control.value, parseInt(label)));
      this.currentStats.datasets.forEach(dataSet => {
        dataSet.label = this.labelsTranslations[dataSet.label];
      });
    }
  }

  private formatDateLabel(timeScale: TimeScale, dateRef: number, length: number = 3): string {
    if (timeScale === TimeScale.WEEKS) {
      return this.labelsTranslations.weeksPrefix + dateRef;
    } else {
      let value = this.labelsTranslations[timeScale][dateRef - 1];
      if (length > 0 && value.length > length) {
        value = value.substr(0, length) + '.';
      }
      return value;
    }
  }

}
