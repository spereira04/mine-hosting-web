import React from 'react';
import { AppRouter } from '@presentation/router';
import { AuthProvider } from '@presentation/context/AuthContext';
import './styles/globals.css';

export default function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}
