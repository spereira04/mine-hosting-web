import React, { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import type { User } from '@domain/entities/User';
import { HttpAuthRepository } from '@infrastructure/repositories/HttpAuthRepository';
import { DummyAuthRepository } from '@infrastructure/repositories/DummyAuthRepository';
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

const authRepo = new DummyAuthRepository(); 

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, { user: null, token: null, loading: true });

  const getToken = () => state.token || localStorage.getItem('token');

  // util para normalizar si te viene "Bearer ..."
  const normalizeToken = (t: string) => (t?.startsWith('Bearer ') ? t.slice(7) : t);

  // ... dentro del AuthProvider:

  const logout = () => {
    localStorage.removeItem('token');
    dispatch({ type: 'LOGOUT' }); // <-- reducer pone loading:false
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
    if (!token) {
      // ⬅️ SIN TOKEN: apagá el spinner
      dispatch({ type: 'SET_LOADING', payload: false });
      return;
    }

    // ⬅️ CON TOKEN: pedí /auth/me y luego LOGIN (que apaga loading)
    (async () => {
      dispatch({ type: 'SET_LOADING', payload: true }); // por si venías en false
      try {
        const user = await authRepo.me(); // Dummy devuelve uno inventado
        dispatch({ type: 'LOGIN', payload: { user, token: normalizeToken(token) } }); // loading:false
      } catch (e) {
        // aseguro que el spinner se apague ante error:
        logout(); // LOGOUT ya pone loading:false
      }
    })();
  }, []);

  const value = useMemo<ContextType>(() => ({
    user: state.user,
    token: state.token,
    loading: state.loading,
    login: async (email, password) => {
      dispatch({ type: 'SET_LOADING', payload: true }); // ⬅️ prende spinner
      try {
        const { token } = await authRepo.login(email, password); // Dummy: token fake
        const raw = normalizeToken(token);
        localStorage.setItem('token', raw);
        const user = await authRepo.me();
        dispatch({ type: 'LOGIN', payload: { user, token: raw } }); // ⬅️ apaga spinner
      } catch (e) {
        // si algo falla, apagá spinner y limpiá
        dispatch({ type: 'SET_LOADING', payload: false });
        logout();
      }
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
