import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@presentation/context/AuthContext';

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token, loading } = useAuth();
  if (loading) return <div style={{ padding: 24 }}>Cargando...</div>;
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
};
