import type { ServerRepository } from '@domain/repositories/ServerRepository';
import type { NewServer, Server } from '@domain/entities/Server';

export class CreateServerUseCase {
  constructor(private repo: ServerRepository) {}
  async execute(input: NewServer): Promise<Server> {
    return this.repo.create(input);
  }
}
