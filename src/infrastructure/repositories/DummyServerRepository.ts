import type { ServerRepository } from '@domain/repositories/ServerRepository';
import type { Server, ServerId } from '@domain/entities/Server';
import type { ServerResources } from '@domain/entities/ServerResources';
import type { Region } from '@domain/entities/Region';
import type { Version } from '@domain/entities/Version';
import type { Type } from '@domain/entities/Type';

const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));

const types: Type[] = [{id: 't2.small', name: 'Chico (2-4 jugadores)', creditCost: 1}, {id: 't2.medium', name: 'Mediano (5-10 jugadores)', creditCost: 2}, {id: 't2.large', name: 'Grande (11-20   jugadores)', creditCost: 3}];
const versions: Version[] = [{id: '1.24', label: '1.24'}, {id: '1.21', label: '1.21'}, {id: '1.20', label: '1.20'}];
const regions: Region[] = [{id: 'us-east-1', name: 'US NORTH'}, {id: 'sa-east-1', name: 'SA EAST'}, {id: 'eu-west-1', name: 'EU WEST'}];
const servers: Server[] = [
  {
    id: "serverId",
    name: "Mi servidor",
    region: { id: "us-east-1", name: "US NORTH"},
    version: { id: "1.24", label: "1.24"},
    type: { id: "t2.small", name: "Chico (2-4 jugadores)", creditCost: 1},
    status: "RUNNING",
    createdAt: new Date().toString()
  }
];

export class DummyServerRepository implements ServerRepository {
  async create(input: { serverName: string; regionId: string; versionId: string, typeId: string }): Promise<Server> {
    await sleep(400);
    const serverCreation: Server = {
      id: '_id',
      name: input.serverName,
      region: { id: input.regionId, name: input.regionId},
      version: { id: input.versionId, label: input.versionId },
      status: 'CREATING',
      type: { id: input.typeId, name: input.typeId, creditCost: 1},
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
    servers[0] = {...servers[0], status: "OFFLINE"};
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const success = true;
        if (success) {
          resolve()
        }else {
          reject();
        }
      }, 500)
    });
  }

  async delete(id: string): Promise<void> {
    servers.pop();
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const success = true;
        if (success) {
          resolve()
        }else {
          reject();
        }
      }, 500)
    });
  }

  async start(owner: string) {
    servers[0] = {
      id: "serverId",
      name: "Pablito",
      region: { id: "us-east-1", name: "US NORTH"},
      version: { id: "1.24", label: "1.24"},
      type: { id: "t2.small", name: "Chico (2-4 jugadores)", creditCost: 1},
      status: "RUNNING",
      createdAt: new Date().toString()
    };
  }

}
