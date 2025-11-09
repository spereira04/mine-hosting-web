import type { ServerDTO, RegionDTO, VersionDTO } from '../http/dtos';
import type { Server } from '@domain/entities/Server';
import type { Region } from '@domain/entities/Region';
import type { Version } from '@domain/entities/Version';


export const toDomainServer = (dto: ServerDTO): Server => ({
  id: dto.InstanceId,
  name: dto.ServerName,
  region:  { id: dto.Region, name: dto.Region},
  version: { id: dto.Version, label: dto.Version },
  type:  { id: dto.Type, name: dto.Type, creditCost: 0 },
  status: dto.status,
  ip: dto.PublicIp,
  createdAt: dto.LaunchedAt
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
