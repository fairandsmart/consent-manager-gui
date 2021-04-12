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
import * as _ from 'lodash';
import { TranslateService } from '@ngx-translate/core';
import {ChartOptions, ChartType} from 'chart.js';
import {Colors} from 'ng2-charts';
import { TimeScale, TIME_SCALES, StatsChart, StatsData } from '@fairandsmart/consent-manager/statistics';

export type ChartConfig = {chartType: ChartType, chartOptions: ChartOptions};

@Component({
  selector: 'cm-dashboard-chart',
  templateUrl: './dashboard-chart.component.html',
  styleUrls: ['./dashboard-chart.component.scss']
})
export class DashboardChartComponent implements OnInit {

  public readonly TIME_SCALES = TIME_SCALES;

  @Input()
  public name;

  public labelsTranslations;

  public timeScale: TimeScale;

  @Input()
  public stats: StatsChart;
  public currentStats: StatsData;

  @Input()
  public chartConfig: ChartConfig;

  @Input()
  public chartColors: Colors[];

  constructor(public translate: TranslateService) {
  }

  ngOnInit(): void {
    this.timeScale = TimeScale.DAYS;
    this.translate.onLangChange.subscribe(() => this.updateTranslations());
    this.updateTranslations();
  }

  updateTranslations(): void {
    this.translate.get([
      'DASHBOARD.ENTRY_TYPES.PROCESSING',
      'DASHBOARD.ENTRY_TYPES.PREFERENCE',
      'DASHBOARD.ENTRY_TYPES.CONDITIONS',
      'DASHBOARD.TIME_LABELS.WEEKS_PREFIX',
      ..._.range(1, 8).map(i => 'DASHBOARD.TIME_LABELS.DAYS.' + i),
      ..._.range(1, 13).map(i => 'DASHBOARD.TIME_LABELS.MONTHS.' + i)
  ]).
    subscribe(translations => {
      this.labelsTranslations = {
        processing: translations['DASHBOARD.ENTRY_TYPES.PROCESSING'],
        preference: translations['DASHBOARD.ENTRY_TYPES.PREFERENCE'],
        conditions: translations['DASHBOARD.ENTRY_TYPES.CONDITIONS'],
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
      return this.labelsTranslations.weeksPrefix + (dateRef < 10 ? '0' + dateRef : dateRef);
    } else {
      let value = this.labelsTranslations[timeScale][dateRef - 1];
      if (length > 0 && value.length > length) {
        value = value.substr(0, length) + '.';
      }
      return value;
    }
  }

}
