import type { Region } from '@domain/entities/Region';
import type { Version } from '@domain/entities/Version';
import type { Type } from '@domain/entities/Type';

export interface ServerResources {
  regions: Region[];
  versions: Version[];
  types: Type[];
}
