import React, { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@presentation/context/AuthContext';
import { CognitoAuthRepository } from '@infrastructure/repositories/CognitoAuthRepository';

export default function SiteHeader() {
  const { user, token, loading, logout } = useAuth();
  const nav = useNavigate();
  const [open, setOpen] = useState(false);

  const logged = Boolean(token);
  const displayName = user?.name || user?.email || 'usuario';
  const initial = (user?.name || user?.email || 'U').slice(0, 1).toUpperCase();

  const linkCx = ({ isActive }: { isActive: boolean }) =>
    `text-sm ${isActive ? 'text-slate-900 font-semibold' : 'text-slate-700'} hover:underline`;

  const formatCredits = (n: number) =>
    new Intl.NumberFormat('es-AR', { maximumFractionDigits: 0 }).format(n);

  function handleLogout() {
    logout();
    setOpen(false);
    nav('/auth/login');
  }

  return (
    <header
      className="
        sticky top-0 z-50 relative
        [--h:48px] sm:[--h:64px]                 /* altura fija y compacta en mobile */
        bg-white/70 backdrop-blur-md
        border-b border-slate-200 shadow-sm
      "
    >
      {/* Barra principal */}
      <div className="mx-auto max-w-[1100px] h-[var(--h)] px-3 sm:px-4 flex items-center justify-between">
        {/* Marca */}
        <Link to="/" className="flex items-center gap-2 min-w-0">
          <span aria-hidden className="text-base sm:text-lg">⛏️</span>
          <span className="font-extrabold text-slate-900 truncate max-w-[60vw] sm:max-w-none text-base sm:text-lg">
            Mine Hosting
          </span>
        </Link>

        {/* Desktop (>= sm): nav completo */}
        <div className="hidden sm:flex items-center gap-3 min-w-0">
          {loading ? (
            <div className="h-6 w-40 animate-pulse rounded bg-slate-200" />
          ) : logged ? (
            <>
              <NavLink to="/app" className={linkCx}>Servidores</NavLink>
              <NavLink to="/store" className={linkCx}>Tienda</NavLink>
              <div
                className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-green-600 text-white text-xs"
                title={user?.email}
              >
                {initial}
              </div>
              <span className="text-sm text-slate-600 truncate max-w-[28ch]">
                Hola, {displayName}
              </span>

              <span
                className="inline-flex items-center gap-1 rounded-full bg-amber-50 text-amber-800 ring-1 ring-amber-200 px-2.5 py-1 text-xs font-semibold select-none"
                title={`${formatCredits(user?.credits!)} créditos`}
                aria-label={`Créditos disponibles: ${formatCredits(user?.credits!)}`}
              >
                <img 
                  src="dollar.png"
                  alt=""
                  className="h-6 w-6 object-cover select-none pointer-events-none"
                  draggable={false}
                />
                <span>{formatCredits(user?.credits!)}</span>
              </span>

              <button
                onClick={handleLogout}
                className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-800 hover:bg-slate-50"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <nav className="flex items-center gap-4">
              <NavLink to="/auth/login" className={linkCx}>Login</NavLink>
              <NavLink to="/auth/signin" className={linkCx}>Sign up</NavLink>
            </nav>
          )}
        </div>

        {/* Mobile (< sm): solo botón menú */}
        <div className="sm:hidden">
          {loading ? (
            <div className="h-9 w-9 animate-pulse rounded-md bg-slate-200" />
          ) : (
            <div>
              <span
                className="inline-flex items-center gap-1 rounded-full bg-amber-50 text-amber-800 ring-1 ring-amber-200 px-2.5 py-1 text-xs font-semibold select-none"
                title={`${formatCredits(user?.credits!)} créditos`}
                aria-label={`Créditos disponibles: ${formatCredits(user?.credits!)}`}
              >
                <img 
                  src="dollar.png"
                  alt=""
                  className="h-6 w-6 object-cover select-none pointer-events-none"
                  draggable={false}
                />
                <span>{formatCredits(user?.credits!)}</span>
              </span>
              <button
                aria-label="Abrir menú"
                aria-expanded={open}
                onClick={() => setOpen(v => !v)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-slate-100 active:bg-slate-200"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Panel móvil como overlay absoluto: NO ocupa altura del header */}
      <div className="sm:hidden absolute left-3 right-3 top-full mt-2 z-[60]">
        <div
          className={`
            rounded-xl border border-slate-200 bg-white shadow-lg overflow-hidden
            transition-[opacity,transform] duration-200
            ${open ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1 pointer-events-none'}
            max-h-[70vh] overflow-auto
          `}
        >
          {logged ? (
            <div className="p-2">
              <div className="flex items-center gap-3 p-2">
                <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-green-600 text-white text-xs">
                  {initial}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-medium text-slate-900 truncate">{displayName}</div>
                  <div className="text-xs text-slate-500 truncate">{user?.email}</div>
                </div>
              </div>
              <hr className="border-slate-200" />
              <nav className="grid p-1">
                <Link to="/app" onClick={() => setOpen(false)} className="px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-md">
                  Servidores
                </Link>
                <Link to="/store" onClick={() => setOpen(false)} className="px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-md">
                  Tienda
                </Link>
                <button onClick={handleLogout} className="text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-md">
                  Cerrar sesión
                </button>
              </nav>
            </div>
          ) : (
            <nav className="grid p-1">
              <Link to="/auth/login" onClick={() => setOpen(false)} className="px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-md">
                Login
              </Link>
              <Link to="/auth/signin" onClick={() => setOpen(false)} className="px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-md">
                Sign up
              </Link>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
}
