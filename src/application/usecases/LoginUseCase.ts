import type { AuthRepository } from '@domain/repositories/AuthRepository';

export class LoginUseCase {
  constructor(private repo: AuthRepository) {}
  async execute(email: string, password: string) {
    return this.repo.login(email, password);
  }
}
