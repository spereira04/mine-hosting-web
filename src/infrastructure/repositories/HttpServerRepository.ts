import type { ServerRepository } from '@domain/repositories/ServerRepository';
import type { NewServer, Server, ServerId } from '@domain/entities/Server';
import { api } from '@infrastructure/http/axiosClient';

export class HttpServerRepository implements ServerRepository {
  async create(server: NewServer): Promise<Server> {
    const { data } = await api.post('/servers', server);
    return data;
  }

  async list(): Promise<Server[]> {
    const { data } = await api.get('/servers');
    return data;
  }

  async getById(id: ServerId): Promise<Server> {
    const { data } = await api.get(`/servers/${id}`);
    return data;
  }
}
