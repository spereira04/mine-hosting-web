import type { ServerRepository } from '@domain/repositories/ServerRepository';
import type { Server } from '@domain/entities/Server';

export class StopServerUseCase {
  constructor(private repo: ServerRepository) {}
  async execute(owner: string): Promise<void> {
    return this.repo.stop(owner);
  }
}