import React from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';

export default function AuthShell() {
  const { pathname } = useLocation();
  const isSignin = pathname.includes('/signin');

  return (
    <div className="relative min-h-screen grid grid-rows-[auto_1fr] overflow-hidden">
      {/* Header */}
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

      {/* Fondo (blur + paneo) */}
      

      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
  {/* Track más chico => menos zoom, pero aún con overscan */}
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

  {/* Scrim para contraste */}
  <div className="absolute inset-0 bg-white/30" />
</div>











      {/* Contenido centrado */}
      <div className="flex items-center justify-center p-6">
        <Outlet />
      </div>
    </div>
  );
}
