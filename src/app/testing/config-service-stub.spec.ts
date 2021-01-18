import { ClientConfigDto } from '../core/models/models';

export class ConfigServiceStubSpec {

  public config: ClientConfigDto = {
    userPageEnabled: false,
    userPageElements: [],
    language: 'fr'
  };

}
