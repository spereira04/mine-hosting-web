import type { Server, ServerId } from '@domain/entities/Server';
import type { ServerResources } from '@domain/entities/ServerResources';

export interface ServerRepository {
  create(input: { serverName: string; regionId: string; versionId: string, typeId: string, owner: string }): Promise<Server>;
  list(owner: string): Promise<Server>;
  getServerResources(): Promise<ServerResources>;
  start(owner: string): Promise<void>;
  stop(owner: string): Promise<void>;
  delete(owner: string): Promise<void>;
}
