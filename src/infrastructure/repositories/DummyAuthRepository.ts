// src/infrastructure/repositories/DummyAuthRepository.ts
import type { AuthRepository } from '@domain/repositories/AuthRepository';
import type { User } from '@domain/entities/User';

export class DummyAuthRepository implements AuthRepository {
  private _user: User | null = null;

  async login(email: string, _password: string) {
    this._user = { id: 'dummy', name: 'Santiago', email, credits: 2500 };
    return { token: 'Bearer dummy-token', user: this._user };
  }

  async signup(name: string, email: string, _password: string) {
    // pretend the user must confirm via code sent by email
    return;
  }

  async confirmSignup(_email: string, _code: string) { return; }
  async resendSignupCode(_email: string) { return; }

  async me(): Promise<User> {
    if (!this._user) throw new Error('Not authenticated');
    return this._user;
  }

  async getToken(): Promise<string | null> { return 'Bearer dummy-token'; }
  async logout(): Promise<void> { this._user = null; }
}
