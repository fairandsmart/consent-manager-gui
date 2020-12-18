import { Component, Input, OnInit } from '@angular/core';
import { StatsChart, StatsData, TIME_SCALES, TimeScale } from '../../../../../core/models/models';
import * as _ from 'lodash';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'cm-dashboard-chart',
  templateUrl: './dashboard-chart.component.html',
  styleUrls: ['./dashboard-chart.component.scss']
})
export class DashboardChartComponent implements OnInit {

  public readonly TIME_SCALES = TIME_SCALES;

  @Input()
  public name;

  @Input()
  public labelsTranslations;

  public timeScale: TimeScale;

  @Input()
  public stats: StatsChart;
  public currentStats: StatsData;

  @Input()
  public chartOptions;

  @Input()
  public chartColors;

  constructor(public translate: TranslateService) {
  }

  ngOnInit(): void {
    this.timeScale = TimeScale.DAYS;
    this.translate.onLangChange.subscribe(() => this.updateTranslations());
    this.updateTranslations();
  }

  updateTranslations(): void {
    this.translate.get([
      'COMMON.ENTRY_TYPES.PROCESSING',
      'COMMON.ENTRY_TYPES.PREFERENCE',
      'COMMON.ENTRY_TYPES.CONDITIONS',
      'DASHBOARD.TIME_LABELS.WEEKS_PREFIX',
      ..._.range(1, 8).map(i => 'DASHBOARD.TIME_LABELS.DAYS.' + i),
      ..._.range(1, 13).map(i => 'DASHBOARD.TIME_LABELS.MONTHS.' + i)
  ]).
    subscribe(translations => {
      this.labelsTranslations = {
        processing: translations['COMMON.ENTRY_TYPES.PROCESSING'],
        preference: translations['COMMON.ENTRY_TYPES.PREFERENCE'],
        conditions: translations['COMMON.ENTRY_TYPES.CONDITIONS'],
        weeksPrefix: translations['DASHBOARD.TIME_LABELS.WEEKS_PREFIX'],
        DAYS: _.range(1, 8).map(i => translations['DASHBOARD.TIME_LABELS.DAYS.' + i]),
        MONTHS: _.range(1, 13).map(i => translations['DASHBOARD.TIME_LABELS.MONTHS.' + i])
      };
      this.updateChart();
    });
  }

  changeTimeScale(timeScale: TimeScale): void {
    this.timeScale = timeScale;
    this.updateChart();
  }

  updateChart(): void {
    if (this.stats && this.labelsTranslations) {
      this.currentStats = _.cloneDeep(this.stats[this.timeScale]);
      this.currentStats.labels = this.currentStats.labels
        // tslint:disable-next-line:radix
        .map(label => this.formatDateLabel(this.timeScale, parseInt(label)));
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
