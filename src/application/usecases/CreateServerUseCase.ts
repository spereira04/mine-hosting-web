import type { ServerRepository } from '@domain/repositories/ServerRepository';
import type { Server } from '@domain/entities/Server';

export class CreateServerUseCase {
  constructor(private repo: ServerRepository) {}
  async execute(input: { serverName: string; region: string; version: string, type: string, owner: string }): Promise<Server> {
    return this.repo.create(input);
  }
}
