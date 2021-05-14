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
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'cm-routing-error-page',
  templateUrl: './routing-error-page.component.html',
  styleUrls: ['./routing-error-page.component.scss']
})
export class RoutingErrorPageComponent implements OnInit {

  public type: number = 404;

  constructor(router: ActivatedRoute) {
    router.queryParams.subscribe((data) => this.type = data.type || 404);
  }

  ngOnInit(): void {
  }

}
