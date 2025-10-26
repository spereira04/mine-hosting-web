import type { NewServer, Server, ServerId } from '@domain/entities/Server';
import type { Region } from '@domain/entities/Region';

export interface ServerRepository {
  create(server: NewServer): Promise<Server>;
  list(): Promise<Server[]>;
  getById(id: ServerId): Promise<Server>;
  getRegions(): Promise<Region[]>;
}
