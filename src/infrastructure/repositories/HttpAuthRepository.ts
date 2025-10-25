import type { AuthRepository } from '@domain/repositories/AuthRepository';
import type { User } from '@domain/entities/User';
import { api } from '@infrastructure/http/axiosClient';

export class HttpAuthRepository implements AuthRepository {
  async login(email: string, password: string): Promise<{ token: string; user: User }> {
    const { data } = await api.post('/auth/login', { email, password });
    // Expected backend response: { token, user }
    return data;
  }

  async signup(name: string, email: string, password: string): Promise<void> {
    await api.post('/auth/signup', { name, email, password });
  }

  async me(): Promise<User> {
    const { data } = await api.get('/auth/me');
    return data;
  }
}
