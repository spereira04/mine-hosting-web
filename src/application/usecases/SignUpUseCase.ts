import type { AuthRepository } from '@domain/repositories/AuthRepository';

export class SignUpUseCase {
  constructor(private repo: AuthRepository) {}
  async execute(name: string, email: string, password: string) {
    await this.repo.signup(name, email, password);
  }
}
