import type { Region } from '@domain/entities/Region';
import type { Version } from '@domain/entities/Version';
import type { Type } from '@domain/entities/Type';

export type ServerId = string;

export interface Server {
  id: ServerId;
  name: string;
  region: Region;
  version: Version;
  type: Type;
  status: string;
  ip?: string;
  createdAt: string;
}
