import type { ServerRepository } from '@domain/repositories/ServerRepository';
import type { Server, ServerId } from '@domain/entities/Server';
import type { ServerResources } from '@domain/entities/ServerResources';
import type { Region } from '@domain/entities/Region';
import type { Version } from '@domain/entities/Version';
import type { Type } from '@domain/entities/Type';

const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));

const types: Type[] = [{id: 't2.small', name: 'Chico (2-4 jugadores)'}, {id: 't2.medium', name: 'Mediano (5-10 jugadores)'}, {id: 't2.large', name: 'Grande (11-20   jugadores)'}];
const versions: Version[] = [{id: '1.24', label: '1.24'}, {id: '1.21', label: '1.21'}, {id: '1.20', label: '1.20'}];
const regions: Region[] = [{id: 'us-east-1', name: 'US NORTH'}, {id: 'sa-east-1', name: 'SA EAST'}, {id: 'eu-west-1', name: 'EU WEST'}];
const servers: Server[] = [];

export class DummyServerRepository implements ServerRepository {
  async create(input: { serverName: string; region: string; version: string, type: string }): Promise<Server> {
    await sleep(400);
    const serverCreation: Server = {
      id: '_id',
      name: input.serverName,
      region: { id: input.region, name: input.region},
      version: { id: input.version, label: input.version },
      status: 'CREATING',
      type: { id: input.type, name: input.type },
      createdAt: Date.now().toString()
    }
    servers.push(serverCreation);
    return serverCreation;
  }

  async list(owner: string): Promise<Server> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const success = servers.length > 0;
        if (success) {
          resolve(servers[0]);
        } else {
          reject(null)
        }
      }, 1000);
    });
  }

  async getById(id: ServerId): Promise<Server> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        let server: Server | null = null;
        let success = false;
        for(const serverIt of servers) {
          if(serverIt.id === id) {
            server = serverIt
            success = true;
            break;
          }
        }
        
        if (success) {
          resolve(server!);
        } else {
          reject(null);
        }
      }, 1000);
    });
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


  async stop(id: string): Promise<void> {}

  async delete(id: string): Promise<void> {}

}
