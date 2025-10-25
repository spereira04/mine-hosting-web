import type { ServerRepository } from '@domain/repositories/ServerRepository';
import type { Server } from '@domain/entities/Server';

export class GetServersUseCase {
  constructor(private repo: ServerRepository) {}
  async execute(): Promise<Server[]> {
    return this.repo.list();
  }
}
