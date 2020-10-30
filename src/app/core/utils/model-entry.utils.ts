import { ModelData, ModelEntryDto, ModelVersionDtoLight, ModelVersionStatus } from '../models/models';

export function getActiveVersionIdentifier(model: ModelEntryDto): string {
  const activeVersion = getActiveVersion(model);
  return activeVersion != null ? `${model.type}/${model.key}/${activeVersion.serial}` : null;
}

export function getActiveVersion<T extends ModelData = ModelData>(model: ModelEntryDto): ModelVersionDtoLight<T> {
  return model.versions.find(v => v.status === ModelVersionStatus.ACTIVE);
}

export function hasActiveVersion(model: ModelEntryDto): boolean {
  return getActiveVersion(model) != null;
}
