import type { ServerRepository } from '@domain/repositories/ServerRepository';
import type { Server, ServerId } from '@domain/entities/Server';
import { api } from '@infrastructure/http/axiosClient';
import { toDomainServer, toDomainRegion, toDomainVersion, toCreateServerRequestDTO } from '../mappers/serverMapper';
import type { ServerDTO, RegionDTO, VersionDTO, CreateServerRequestDTO } from '../http/dtos';
import { ServerResources } from '@domain/entities/ServerResources';
import { useAuth } from '@presentation/context/AuthContext';

import { Region } from '@domain/entities/Region';
import { Type } from '@domain/entities/Type';
import { Version } from '@domain/entities/Version';

export class HttpServerRepository implements ServerRepository {
  async create(input: { serverName: string; regionId: string; versionId: string, typeId: string, owner: string }): Promise<Server> {
    const body = {
      serverName: input.serverName, 
      serverVersion: input.versionId, 
      serverType: input.typeId, 
      serverRegion: input.regionId,
      owner: input.owner,
      operation: "CREATE"}
    const { data } = await api.post('/serverAction', body);
    return data;
  }

  async list(owner: string): Promise<Server> {
    const { data } = await api.get<ServerDTO>('/serverStatus', {
      params: {
        owner: owner
      }
    });
    try {
      return toDomainServer(data);
    } catch(err) {
      throw new Error(`Server not found ${err}`);
    }
  }

  async getServerResources(): Promise<ServerResources> {
    const { data } = await api.get<ServerResources>(`/resources`);
    return data;
  } 


  async stop(owner: string): Promise<void> {
    const body = {
      operation: "TURNOFF",
      owner: owner
    };
    await api.post(`/serverAction`, body);
  }

  async delete(owner: string): Promise<void> {
    const body = {
      operation: "DELETE",
      owner: owner
    }
    await api.post(`/serverAction`, body);
  }

  async start(owner: string): Promise<void> {
    const body = {
      operation: "TURNON",
      owner: owner
    }
    await api.post(`/serverAction`, body);
  }
}