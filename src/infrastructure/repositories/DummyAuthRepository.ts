import type { User } from '@domain/entities/User';
import type { AuthRepository } from '@domain/repositories/AuthRepository';

const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));

export class DummyAuthRepository implements AuthRepository {
  async login(email: string, _password: string): Promise<{ token: string; user: User }> {
    await sleep(200);
    const user: User = {
      id: 'user_FAKE_' + Math.random().toString(36).slice(2, 7),
      name: 'Santiago Pereira',
      email: email || 'santipereira1987@gmail.com',
      credits: 10000
    };
    const token = 'FAKE_' + Math.random().toString(36).slice(2, 10); // crudo, sin "Bearer "
    return { token, user }; // la UI ignorará este user y llamará a me()
  }

  async me(): Promise<User> {
    await sleep(150);
    return {
      id: 'user_FAKE_STATIC',
      name: 'Santiago Pereira',
      email: 'santipereira1987@gmail.com',
      credits: 10000
    };
  }

  async signup(name: string, email: string, _password: string): Promise<void> {
    await sleep(250);
    return;
  }
}
