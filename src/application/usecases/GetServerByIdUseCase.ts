import type { ServerRepository } from '@domain/repositories/ServerRepository';
import type { Server, ServerId } from '@domain/entities/Server';

export class GetServerByIdUseCase {
  constructor(private repo: ServerRepository) {}
  async execute(id: ServerId): Promise<Server> {
    return this.repo.getById(id);
  }
}
