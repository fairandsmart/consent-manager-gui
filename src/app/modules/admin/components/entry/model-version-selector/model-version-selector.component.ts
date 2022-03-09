import { Component, OnInit } from '@angular/core';
import { ModelVersionType } from '@fairandsmart/consents-ce/models';

@Component({
  selector: 'cm-model-version-selector',
  templateUrl: './model-version-selector.component.html',
  styleUrls: ['./model-version-selector.component.scss']
})
export class ModelVersionSelectorComponent implements OnInit {

  readonly TYPES = ModelVersionType;

  constructor() { }

  ngOnInit(): void {
  }

}
