import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@presentation/context/AuthContext';
import { SiteHeader } from '@presentation/components/SiteHeader';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();
  const isSignin = pathname.includes('/signin');
  return (
    <div>
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div
          className="absolute left-1/2 top-1/3 h-[150vh] w-[130vw] transform-gpu transition-transform duration-700 ease-in-out"
          style={{
            // Centrado horizontal (-50%) + paneo sutil a la derecha en /signin
            transform: `translate(calc(-50% ${isSignin ? '- 15vw' : '+ 0vw'}), -50%)`,
          }}
        >
          <img
            src="/images/minecraft_landscape.jpg"
            alt=""
            className="h-full w-full object-cover blur-[2px] select-none pointer-events-none"
            draggable={false}
          />
        </div>
        <div className="absolute inset-0 bg-white/30" />
      </div>

      <SiteHeader/>
      <main style={{ padding: 16, maxWidth: 900, margin: '0 auto' }}>{children}</main>
    </div>
  );
};
