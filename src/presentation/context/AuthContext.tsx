import React, { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import type { User } from '@domain/entities/User';
import { DummyAuthRepository } from '@infrastructure/repositories/DummyAuthRepository';
import { LoginUseCase } from '@application/usecases/LoginUseCase';
import { SignUpUseCase } from '@application/usecases/SignUpUseCase';
import { api } from '@infrastructure/http/axiosClient';
import { setupInterceptors } from '@infrastructure/http/interceptors';
import { CognitoAuthRepository } from '@infrastructure/repositories/CognitoAuthRepository';

type State = {
  user: User | null;
  token: string | null;
  loading: boolean;
};

type Action =
  | { type: 'LOGIN'; payload: { user: User; token: string } }
  | { type: 'LOGOUT' }
  | { type: 'SET_LOADING'; payload: boolean };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, user: action.payload.user, token: action.payload.token, loading: false };
    case 'LOGOUT':
      return { ...state, user: null, token: null, loading: false };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    default:
      return state;
  }
}

type ContextType = {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  confirmSignup: (email: string, code: string) => Promise<void>;     // NEW
  resendSignupCode: (email: string) => Promise<void>;                // NEW
  logout: () => void;
}

const AuthContext = createContext<ContextType | undefined>(undefined);

const authRepo = new CognitoAuthRepository(); 

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, { user: null, token: null, loading: true });

  const getToken = () => state.token || localStorage.getItem('token');

  const normalizeToken = (t: string) => (t?.startsWith('Bearer ') ? t.slice(7) : t);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    dispatch({ type: 'LOGOUT' });
  };

  useEffect(() => {
    setupInterceptors(api, {
      getToken: () => state.token || localStorage.getItem('token'),
      onUnauthorized: logout,
      onRequest: () => {},
      onResponse: () => {},
      onError: () => {},
    });

    const token = localStorage.getItem('token');
    const email = localStorage.getItem('userEmail');
    if (!token || !email) {
      dispatch({ type: 'SET_LOADING', payload: false });
      return;
    }

    (async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        const user = await authRepo.me(email);
        dispatch({ type: 'LOGIN', payload: { user, token: normalizeToken(token) } });
      } catch (e) {
        logout();
      }
    })();
  }, []);

  const value = useMemo<ContextType>(() => ({
    user: state.user,
    token: state.token,
    loading: state.loading,
    login: async (email, password) => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        console.log("calling login");
        const { token } = await authRepo.login(email, password);
        const raw = normalizeToken(token);
        localStorage.setItem('token', raw);
        localStorage.setItem('userEmail', email);

        const user = await authRepo.me(email);
        dispatch({ type: 'LOGIN', payload: { user, token: raw } });
      } catch (e) {
        dispatch({ type: 'SET_LOADING', payload: false });
        logout();
      }
    },
    signup: async (name: string, email: string, password: string) => {
      const usecase = new SignUpUseCase(authRepo);
      await usecase.execute(name, email, password);
    },
    logout,
    confirmSignup: async (email: string, code: string) => {
      await authRepo.confirmSignup(email, code);
    },
    resendSignupCode: async (email: string) => {
      await authRepo.resendSignupCode(email);
    }
  }), [state.user, state.token, state.loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
