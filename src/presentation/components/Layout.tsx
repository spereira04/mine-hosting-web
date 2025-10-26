// src/presentation/components/Layout.tsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import SiteHeader from '@presentation/components/SiteHeader';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { pathname } = useLocation();
  const isAuth = pathname.startsWith('/auth');
  const isSignin = pathname.includes('/signin');

  return (
    <div className="relative min-h-[100dvh] overflow-x-clip">
      {/* FIXED background: always behind, never ends */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        {/* Overscanned track (wider/taller than viewport), centered */}
        <div
          className={[
            'absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2',
            'h-[115dvh] w-[135vw] transform-gpu',
            'transition-transform duration-700 ease-in-out',
            // Pan a little only on auth/signin; stays centered elsewhere
            isAuth && isSignin ? '-translate-x-[30vw]' : 'translate-x-0',
          ].join(' ')}
        >
          <img
            src="/images/minecraft_landscape.jpg"
            alt=""
            className="h-full w-full object-cover blur-[2px] select-none pointer-events-none"
            draggable={false}
          />
        </div>
        {/* Scrim to keep text readable */}
        <div className="absolute inset-0 bg-white/30" />
      </div>

      {/* Header (example) */}
      <SiteHeader/>

      {/* Page content */}
      <main className="mx-auto w-full max-w-5xl p-4 sm:p-6">
        {children}
      </main>
    </div>
  );
};
