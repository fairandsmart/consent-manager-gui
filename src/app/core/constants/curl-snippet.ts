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

import { environment } from '../../../environments/environment';
import { ConsentContext } from '@fairandsmart/consents-ce/consents';

export const CURL_TOKEN_SNIPPET = (api: string, json: string) =>
`curl '${api}/consents' \\
  -H 'Accept: application/json, text/plain, */*' \\
  -H 'Authorization: Bearer PUT_YOUR_ADMIN_ACCESS_TOKEN_HERE' \\
  -H 'Content-Type: application/json' \\
  --data-binary '${json}' \\
  --compressed`;

export function getCurlTokenSnippetFromContext(context: ConsentContext): string {
  return CURL_TOKEN_SNIPPET(environment.managerUrl, JSON.stringify(context));
}

export const CURL_LOCATION_SNIPPET = (api: string) =>
`curl '${api}/consents/PUT_YOUR_TRANSACTION_TOKEN_HERE' \\
  -H 'Accept: application/json, text/plain, */*' \\
  -H 'Authorization: Bearer PUT_YOUR_ADMIN_ACCESS_TOKEN_HERE'`;

export function getCurlLocationSnippet(): string {
  return CURL_LOCATION_SNIPPET(environment.managerUrl);
}
