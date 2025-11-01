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

const types: Type[] = [{id: 't2.small', name: 'Chico (2-4 jugadores)'}, {id: 't2.medium', name: 'Mediano (5-10 jugadores)'}, {id: 't2.large', name: 'Grande (11-20   jugadores)'}];
const versions: Version[] = [{id: '1.24', label: '1.24'}, {id: '1.21', label: '1.21'}, {id: '1.20', label: '1.20'}];
const regions: Region[] = [{id: 'us-east-1', name: 'US NORTH'}, {id: 'sa-east-1', name: 'SA EAST'}, {id: 'eu-west-1', name: 'EU WEST'}];

const typesMap: Map<string, string> = new Map<string, string>([
  ['Chico (2-4 jugadores)', 't2.small'],
  ['Mediano (5-10 jugadores)', 't2.medium'],
  ['Grande (11-20   jugadores)', 't2.large']
]);

const regionsMap: Map<string, string> = new Map<string, string>([
  ['US NORTH', 'us-east-1'],
  ['SA EAST', 'sa-east-1'],
  ['EU WEST', 'eu-west-1']
]);

export class HttpServerRepository implements ServerRepository {
  async create(input: { serverName: string; region: string; version: string, type: string, owner: string }): Promise<Server> {
    input.region = regionsMap.get(input.region) || input.region;
    input.type = typesMap.get(input.type) || input.type;
    const body = {payload: input, operation: "CREATE"}
    const { data } = await api.post('/serversActions', body);
    console.log(body);
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
    let serverResources: ServerResources = {regions: regions, versions: versions, types: types};
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const success = true;
        if (success) {
          resolve(serverResources);
        } else {
          reject(null);
        }
      }, 1000);
    });
  } 


  async stop(id: string): Promise<void> {

  }

  async delete(id: string): Promise<void> {

  }
}