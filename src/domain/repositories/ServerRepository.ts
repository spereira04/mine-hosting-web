import type { Server, ServerId } from '@domain/entities/Server';
import type { ServerResources } from '@domain/entities/ServerResources';

export interface ServerRepository {
  create(input: { name: string; region: string; version: string, type: string }): Promise<Server>;
  list(): Promise<Server>;
  getById(id: ServerId): Promise<Server>;
  getServerResources(): Promise<ServerResources>;
}
