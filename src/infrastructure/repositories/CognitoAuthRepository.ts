// src/infrastructure/repositories/CognitoAuthRepository.ts
import { Amplify } from 'aws-amplify';
import {
  signIn,
  signOut,
  signUp,
  getCurrentUser,
  fetchUserAttributes,
  fetchAuthSession,
  confirmSignUp,
  resendSignUpCode,
  type UserAttributeKey,
} from 'aws-amplify/auth';

import { api } from '@infrastructure/http/axiosClient';
import type { AuthRepository } from '@domain/repositories/AuthRepository';
import type { User } from '@domain/entities/User';
import { ServerDTO } from '@infrastructure/http/dtos';

let _configured = false;
export function initCognitoAuth() {
  if (_configured) return;
  Amplify.configure({
    Auth: {
      Cognito: {
        userPoolId:       import.meta.env.VITE_COGNITO_USER_POOL_ID,
        userPoolClientId: import.meta.env.VITE_COGNITO_WEB_CLIENT_ID,
      },
    },
  });
  _configured = true;
}

function mapAttributesToUser(
  attrs: Partial<Record<UserAttributeKey, string>>,
  fallbackUsername?: string
): User {
  const id = attrs.sub ?? fallbackUsername ?? 'unknown';
  const email = attrs.email ?? fallbackUsername ?? '';
  const name =
    attrs.name ??
    attrs.given_name ??
    attrs.preferred_username ??
    (email ? email.split('@')[0] : 'Usuario');

  const anyAttrs = attrs as Record<string, string | undefined>;
  const rawCredits = anyAttrs['custom:credits'];
  const credits = typeof rawCredits === 'string' ? Number(rawCredits) : 0;

  return { id, name, email, credits };
}

export class CognitoAuthRepository implements AuthRepository {
  constructor() { initCognitoAuth(); }

  async login(email: string, password: string) {
    console.log("Calling login inside repo");
    await signIn({ username: email, password });
    console.log("Made login call inside repo");
    const [session, current] = await Promise.all([fetchAuthSession(), getCurrentUser()]);
    const attrs = await fetchUserAttributes();
    const user = mapAttributesToUser(attrs, current.username);
    const idToken = session.tokens?.idToken?.toString() ?? '';
    return { token: `Bearer ${idToken}`, user };
  }

  async signup(name: string, email: string, password: string) {
    await signUp({
      username: email,
      password,
      options: { userAttributes: { email, name } },
    });
  }

  async confirmSignup(email: string, code: string): Promise<void> {
    const res = await confirmSignUp({ username: email, confirmationCode: code });
    if (!res.isSignUpComplete) {
      // Optionally throw to force the caller to handle nextStep
      // throw new Error('Sign up not complete. Next step: ' + res.nextStep?.signUpStep);
    }
  }

  async resendSignupCode(email: string): Promise<void> {
    await resendSignUpCode({ username: email });
  }

  async me(owner: string): Promise<User> {
    const current = await getCurrentUser();
    const attrs = await fetchUserAttributes();
    let user = mapAttributesToUser(attrs, current.username);

    const { data } = await api.get<{Name: string, Credits: number}>(`/me`, {
      params: {
        owner: owner
      }
    });
    user = {...user, credits: data.Credits, name: data.Name};
    console.log(user);

    return user;
  }

  async getToken(): Promise<string | null> {
    try {
      const s = await fetchAuthSession();
      return s.tokens?.idToken?.toString() ?? null;
    } catch { return null; }
  }

  async logout(): Promise<void> {
    await signOut();
  }
}
