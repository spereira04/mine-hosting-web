import type { NewServer, Server, ServerId } from '@domain/entities/Server';

export interface ServerRepository {
  create(server: NewServer): Promise<Server>;
  list(): Promise<Server[]>;
  getById(id: ServerId): Promise<Server>;
}
