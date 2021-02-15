

export const FIELD_VALIDATORS = {
  key: {
    pattern: '^[0-9a-zA-Z-_.]{2,255}$'
  },
  name: {
    min: 2,
    max: 255
  },
  description: {
    max: 2500
  },
  elementsKeys: {
    pattern: '^([0-9a-zA-Z-_.]{2,255},)*[0-9a-zA-Z-_.]{2,255}$'
  },
  phone: {
    pattern: '^\\+?[0-9]+$'
  }
};

export enum Icons {
  basicinfo = 'info',
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
  subject = 'people'
}
