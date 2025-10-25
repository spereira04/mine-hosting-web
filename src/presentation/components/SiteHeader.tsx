import React from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';

export const SiteHeader: React.FC = () => (
  <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/55 backdrop-blur">
    <div className="mx-auto max-w-[1100px] px-4 py-3 flex items-center justify-between text-slate-900">
      <div className="flex items-center gap-2 font-extrabold text-lg">
        <span aria-hidden>⛏️</span>
        <span>Mine Hosting</span>
      </div>
      <nav className="flex items-center gap-4 text-sm">
        <Link to="/auth/login" className="hover:underline">Login</Link>
        <Link to="/auth/signin" className="hover:underline">Sign up</Link>
      </nav>
    </div>
  </header>
);
