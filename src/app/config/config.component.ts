import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss']
})
export class ConfigComponent implements OnInit {

  public showModelSubsections = false;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.showModelSubsections = this.router.url.includes('/config');
  }

  toggleSection() {
    this.showModelSubsections = !this.showModelSubsections;
  }

}
