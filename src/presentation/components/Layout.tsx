import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@presentation/context/AuthContext';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  return (
    <div>
      <header style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ fontWeight: 700 }}>
          <Link to="/app">Minecraft Hosting</Link>
        </div>
        <nav style={{ display: 'flex', gap: 12 }}>
          {user ? (
            <>
              <span>Hola, {user.name}</span>
              <button onClick={logout}>Cerrar sesión</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/signin">Sign up</Link>
            </>
          )}
        </nav>
      </header>
      <main style={{ padding: 16, maxWidth: 900, margin: '0 auto' }}>{children}</main>
    </div>
  );
};
