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

const PEER_PATTERN = '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}';
const KEY_PATTERN = `[0-9a-zA-Z-_.]{2,255}`;
const KEY_PEER_PATTERN = `peer\/${PEER_PATTERN}\/${KEY_PATTERN}`;

export const FIELD_VALIDATORS = {
  key: {
    pattern: `^${KEY_PATTERN}$`
  },
  name: {
    min: 2,
    max: 255
  },
  description: {
    max: 2500
  },
  elementsKeys: {
    pattern: `^(${KEY_PATTERN},)*${KEY_PATTERN}$`
  },
  phone: {
    pattern: '^\\+?[0-9]+$'
  }
};

export enum Icons {
  information = 'info',
  processing = 'fact_check',
  preference = 'favorite',
  conditions = 'text_snippet',
  email = 'mail',
  theme = 'palette',
  cookies = 'local_offer',
  gettingStarted = 'help',
  collect = 'integration_instructions',
  interrogate = 'search',
  security = 'vpn_key',
  all = 'assignment_turned_in',
  subject = 'people',
  peers = 'group'
}
