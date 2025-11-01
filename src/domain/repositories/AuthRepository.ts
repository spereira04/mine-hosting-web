import type { User } from '@domain/entities/User';

export interface AuthRepository {
  login(email: string, password: string): Promise<{ token: string; user: User }>;
  signup(name: string, email: string, password: string): Promise<void>;
  me(): Promise<User>;
  getToken?(): Promise<string | null>;
  logout(): Promise<void>; 
  confirmSignup(email: string, code: string): Promise<void>;
  resendSignupCode(email: string): Promise<void>;
}
