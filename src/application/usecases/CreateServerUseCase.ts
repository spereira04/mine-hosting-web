import type { ServerRepository } from '@domain/repositories/ServerRepository';
import type { Server } from '@domain/entities/Server';

export class CreateServerUseCase {
  constructor(private repo: ServerRepository) {}
  async execute(input: { serverName: string; regionId: string; versionId: string, typeId: string, owner: string }): Promise<Server> {
    return this.repo.create(input);
  }
}
