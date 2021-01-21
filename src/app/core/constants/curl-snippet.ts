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
import { ConsentContext } from '../models/models';
import { environment } from '../../../environments/environment';

export const CURL_SNIPPET =
`curl '$$API_URL$$/consents/token' \\
  -H 'Accept: application/json, text/plain, */*' \\
  -H 'Authorization: Basic PUT_YOUR_BASE_64_ENCODED_API_KEY' \\
  -H 'Content-Type: application/json' \\
  --data-binary '$$JSON$$' \\
  --compressed
`;

export function getCurlSnippetFromContext(context: ConsentContext): string {
  return CURL_SNIPPET
    .replace('$$API_URL$$', environment.managerUrl)
    .replace('$$JSON$$', JSON.stringify(context));
}
