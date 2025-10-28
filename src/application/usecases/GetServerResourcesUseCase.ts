import type { ServerRepository } from '@domain/repositories/ServerRepository';
import type { ServerResources } from '@domain/entities/ServerResources';

export class GetServerResourcesUseCase {
  constructor(private repo: ServerRepository) {}
  async execute(): Promise<ServerResources> {
    return this.repo.getServerResources();
  }
}