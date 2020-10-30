import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'cm-operator-subject-page',
  templateUrl: './operator-subject-page.component.html',
  styleUrls: ['./operator-subject-page.component.scss']
})
export class OperatorSubjectPageComponent implements OnInit {

  public subject: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.subject = params.get('subject');
    });
  }

  operatorActionProcessing(event): void {
    console.log('operator action: processing');
    console.log(event);
  }

  operatorActionPreferences(event): void {
    console.log('operator action: preferences');
    console.log(event);
  }

}
