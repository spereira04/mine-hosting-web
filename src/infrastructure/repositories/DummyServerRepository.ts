import type { ServerRepository } from '@domain/repositories/ServerRepository';
import type { NewServer, Server, ServerId } from '@domain/entities/Server';
import type { Region } from '@domain/entities/Region';

const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));

const regions: Region[] = [{id: 'us-east-1', name: 'US NORTH'}, {id: 'sa-east-1', name: 'SA EAST'}, {id: 'eu-west-1', name: 'EU WEST'}];
const servers: Server[] = [];

export class DummyServerRepository implements ServerRepository {
  async create(server: NewServer): Promise<Server> {
    await sleep(400);
    const serverCreation: Server = {
      id: '_id',
      name: server.name,
      region: server.region,
      version: server.version,
      status: 'CREATING',
      createdAt: Date.now().toString()
    }
    servers.push(serverCreation);
    return serverCreation;
  }

  async list(): Promise<Server[]> {
    await sleep(400);
    return new Promise(servers);
  }

  async getById(id: ServerId): Promise<Server> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const server: Server | null = null;
        const success = false;
        for(const serverIt of servers) {
          if(serverIt.id === id) {
            server = serverIt
            success = true;
            break;
          }
        }
        
        if (success) {
          resolve(server);
        } else {
          reject(null);
        }
      }, 1000);
    });
  }

  async getRegions(): Promise<Region[]> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const success = true;
        if (success) {
          resolve(regions);
        } else {
          reject(null);
        }
      }, 1);
    });
  }
}
