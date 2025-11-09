import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@presentation/context/AuthContext';
import { Layout } from '@presentation/components/Layout';

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token, loading } = useAuth();

  if (loading) {
    return (
      <Layout>
        <div className="grid min-h-[60vh] place-items-center px-4">
          <div
            role="status"
            aria-live="polite"
            aria-busy="true"
            className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-slate-700 shadow-sm"
          >
            <svg
              className="h-5 w-5 animate-spin text-green-600"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden
            >
              <circle className="opacity-25" cx="12" cy="12" r="10"
                      stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
            <span className="text-sm font-medium">Cargando…</span>
          </div>
        </div>
      </Layout>
    );
  }

  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
};
