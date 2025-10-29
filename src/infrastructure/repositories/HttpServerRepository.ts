import type { ServerRepository } from '@domain/repositories/ServerRepository';
import type { Server, ServerId } from '@domain/entities/Server';
import { api } from '@infrastructure/http/axiosClient';
import { toDomainServer, toDomainRegion, toDomainVersion, toCreateServerRequestDTO } from '../mappers/serverMapper';
import type { ServerDTO, RegionDTO, VersionDTO, CreateServerRequestDTO } from '../http/dtos';
import { ServerResources } from '@domain/entities/ServerResources';

export class HttpServerRepository implements ServerRepository {
  async create(input: { name: string; region: string; version: string, type: string }): Promise<Server> {
    const { data } = await api.post('/servers', input);
    return data;
  }

  async list(): Promise<Server> {
    const { data } = await api.get<ServerDTO>('/servers');
    try {
      return toDomainServer(data);
    } catch(err) {
      throw new Error(`Server not found ${err}`);
    }
  }

  async getById(id: ServerId): Promise<Server> {
    const { data } = await api.get<ServerDTO>(`/servers/${id}`);
    return toDomainServer(data);
  }

  async getServerResources(): Promise<ServerResources> {
    //TODO implement 
    return {} as ServerResources;
  } 
}