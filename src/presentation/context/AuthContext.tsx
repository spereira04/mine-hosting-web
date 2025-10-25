import React, { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import type { User } from '@domain/entities/User';
import { HttpAuthRepository } from '@infrastructure/repositories/HttpAuthRepository';
import { LoginUseCase } from '@application/usecases/LoginUseCase';
import { SignUpUseCase } from '@application/usecases/SignUpUseCase';
import { api } from '@infrastructure/http/axiosClient';
import { setupInterceptors } from '@infrastructure/http/interceptors';

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
  logout: () => void;
}

const AuthContext = createContext<ContextType | undefined>(undefined);

const authRepo = new HttpAuthRepository();

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, { user: null, token: null, loading: true });

  const getToken = () => state.token || localStorage.getItem('token');

  const logout = () => {
    localStorage.removeItem('token');
    dispatch({ type: 'LOGOUT' });
  };

  useEffect(() => {
    setupInterceptors(api, {
      getToken,
      onUnauthorized: logout,
      onRequest: () => {},
      onResponse: () => {},
      onError: () => {}
    });
    // Try restore session
    const token = localStorage.getItem('token');
    if (!token) {
      dispatch({ type: 'SET_LOADING', payload: false });
      return;
    }
    (async () => {
      try {
        const user = await authRepo.me();
        dispatch({ type: 'LOGIN', payload: { user, token } });
      } catch {
        logout();
      }
    })();
  }, []);

  const value = useMemo<ContextType>(() => ({
    user: state.user,
    token: state.token,
    loading: state.loading,
    login: async (email: string, password: string) => {
      const usecase = new LoginUseCase(authRepo);
      const { token, user } = await usecase.execute(email, password);
      localStorage.setItem('token', token);
      dispatch({ type: 'LOGIN', payload: { user, token } });
    },
    signup: async (name: string, email: string, password: string) => {
      const usecase = new SignUpUseCase(authRepo);
      await usecase.execute(name, email, password);
    },
    logout
  }), [state.user, state.token, state.loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
