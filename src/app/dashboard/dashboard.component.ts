import { Component, OnInit } from '@angular/core';
import { RecordsResourceService } from '../records-resource.service';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { map } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
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

  public subjects: string[] = [];
  public filteredSubjects: Observable<string[]>;
  public searchValue: FormControl;

  constructor(
    public recordsService: RecordsResourceService,
    private route: ActivatedRoute,
    private router: Router) {
  }

  ngOnInit(): void {
    this.searchValue = new FormControl();
    this.recordsService.findSubjects('').subscribe((response) => this.subjects = response);
    this.filteredSubjects = this.searchValue.valueChanges.pipe(map((value) => this.filterSubjects(value)));
    this.recordsService.getStats().subscribe((response) => {
      // TODO
    this.numbersData = {
        subjects: 1,
        records: 2
      };
    this.recordsAverageData = {
        chartLabels: ['Traitements', 'Préférences', 'CGU'],
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
            label: 'Traitements'
          },
          {
            data: [3, 2, 0, 1, 4, 0, 2],
            label: 'Préférences'
          },
          {
            data: [4, 1, 2, 3, 2, 2, 1],
            label: 'CGU'
          }
        ]
      };
    this.answersWeekData = {
        chartLabels: ['21/09', '22/09', '23/09', '24/09', '25/09', '26/09', '27/09'],
        chartData: [
          {
            data: [8, 7, 4, 1, 0, 5, 3],
            label: 'Oui'
          },
          {
            data: [3, 5, 2, 3, 4, 1, 2],
            label: 'Non'
          }
        ]
      };
    });
  }

  private filterSubjects(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.subjects.filter(subject => subject.toLowerCase().includes(filterValue));
  }

  goToPage() {
    const subject = this.searchValue.value == null ? '' : this.searchValue.value.trim();
    if (subject) {
      this.router.navigate(['.', subject], {relativeTo: this.route});
    }
  }

}
