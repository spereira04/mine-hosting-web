import type { ServerDTO, RegionDTO, VersionDTO } from '../http/dtos';
import type { Server } from '@domain/entities/Server';
import type { Region } from '@domain/entities/Region';
import type { Version } from '@domain/entities/Version';

//Implement maps for region, version and type

const regionNames = new Map<string, string>([
  ['a', ''],
  ['b', ''],
]);

const typeNames = new Map<string, string>([

]);

export const toDomainServer = (dto: ServerDTO): Server => ({
  id: dto.id,
  name: dto.name,
  region:  { id: dto.region, name: regionNames.get(dto.region)!},
  version: { id: dto.version, label: dto.version },
  status: dto.status,
  ip: dto.ip,
  createdAt: dto.createdAt
});

export const toDomainRegion = (dto: RegionDTO): Region => ({
  id: dto.id,
  name: dto.name,
});

export const toDomainVersion = (dto: VersionDTO): Version => ({
  id: dto.id,
  label: dto.label,
});


export const toCreateServerRequestDTO = (input: {
  name: string; regionId: Region['id']; versionId: Version['id'];
}): { name: string; regionId: string; versionId: string } => ({
  name: input.name,
  regionId: input.regionId as unknown as string,
  versionId: input.versionId as unknown as string,
});
