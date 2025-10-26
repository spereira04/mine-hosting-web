import type { ServerRepository } from '@domain/repositories/ServerRepository';
import type { Region } from '@domain/entities/Region';

export class GetServerRegionsUseCase {
  constructor(private repo: ServerRepository) {}
  async execute(): Promise<Region[]> {
    return this.repo.getRegions();
  }
}