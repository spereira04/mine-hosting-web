import type { ServerRepository } from '@domain/repositories/ServerRepository';
import type { Server } from '@domain/entities/Server';

export class GetServersUseCase {
  constructor(private repo: ServerRepository) {}
  async execute(owner: string): Promise<Server[]> {
    return this.repo.list(owner).then((data: Server) => {
        return [data];
      })
      .catch((error: Error) => {
        return []; 
      });
  }
}
