import type { Server, ServerId } from '@domain/entities/Server';
import type { ServerResources } from '@domain/entities/ServerResources';

export interface ServerRepository {
  create(input: { serverName: string; region: string; version: string, type: string, owner: string }): Promise<Server>;
  list(): Promise<Server>;
  getById(id: ServerId): Promise<Server>;
  getServerResources(): Promise<ServerResources>;

  stop(id: string): Promise<void>;
  delete(id: string): Promise<void>;
}
