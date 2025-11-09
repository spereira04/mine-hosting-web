// src/presentation/components/ServerList.tsx
import React, { useState } from 'react';
import type { Server } from '@domain/entities/Server';

const badge: Record<Server['status'], string> = {
  RUNNING: 'border border-emerald-200 bg-emerald-50 text-emerald-700',
  CREATING: 'border border-amber-200 bg-amber-50 text-amber-700',
  OFFLINE: 'border border-slate-200 bg-slate-50 text-slate-700',
  STARTING: 'border border-blue-200 bg-slate-50 text-blue-700',
  DELETING: 'border border-red-200 bg-red-50 text-red-700',
};

type Props = {
  servers: Server[];
  onStop?: () => Promise<void> | void;
  onDelete?: () => Promise<void> | void;
  onRefresh?: () => Promise<void> | void;
  refreshing?: boolean;
  onStart?: () => Promise<void> | void;
};

type BusyKind = 'stop' | 'start' | 'delete' | null;

export const ServerList: React.FC<Props> = ({
  servers,
  onStop,
  onDelete,
  onRefresh,
  refreshing = false,
  onStart,
}) => {
  // busy por servidor
  const [busy, setBusy] = useState<Record<string, BusyKind>>({});

  if (!servers.length) {
    return <div className="text-sm text-slate-600">No tenés un servidor todavía.</div>;
  }

  return (
    <div className="w-full">
      {/* Toolbar superior */}
      <div className="mb-3 flex items-center justify-between">
        <h4 className="text-sm font-semibold text-slate-900">
        </h4>
        {onRefresh && (
          <button
            type="button"
            onClick={() => onRefresh()}
            disabled={refreshing}
            className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-800 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Actualizar listado"
          >
            <svg
              viewBox="0 0 24 24"
              className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`}
              fill="none"
              aria-hidden
            >
              <path d="M4 4v6h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M20 20v-6h-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M20 10a8 8 0 10-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {refreshing ? 'Actualizando…' : 'Actualizar'}
          </button>
        )}
      </div>

      <ul className="grid gap-3">
        {servers.map((s) => {
          const b = busy[s.id] ?? null;
          const isBusy = b !== null;

          const canStop = s.status === 'RUNNING' && !!onStop && !isBusy;
          const canDelete = s.status === 'OFFLINE' && !!onDelete && !isBusy;
          const canStart = s.status === 'OFFLINE' && !!onStart && !isBusy;

          return (
            <li key={s.id} className="rounded-xl border border-slate-200 bg-white/90 p-3 sm:p-4">
              <div className="flex items-center justify-between gap-3">
                <strong className="truncate">{s.name}</strong>
                <span className={`text-xs px-2 py-0.5 rounded-full ${badge[s.status]}`}>
                  {s.status}
                </span>
              </div>

              <div className="mt-2 text-xs sm:text-sm text-slate-600 flex flex-wrap gap-x-3 gap-y-1">
                <span className="whitespace-nowrap">Región: {s.region.name}</span>
                <span className="whitespace-nowrap">Versión: {s.version.label}</span>
                <span className="whitespace-nowrap">{s.ip ? `IP: ${s.ip}:25565` : ''}</span>
                <span className="whitespace-nowrap">
                  {s.createdAt ? `Iniciado: ${new Date(s.createdAt).toLocaleString()}` : ''}
                </span>
                <span className="whitespace-nowrap">{s.type ? `Instancia: ${s.type.name}` : ''}</span>
              </div>

              {/* Acciones o spinner */}
              <div className="mt-3 min-h-[40px]">
                {isBusy ? (
                  <div
                    className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-800"
                    aria-live="polite"
                    aria-busy="true"
                  >
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden>
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                    {b === 'stop' ? 'Deteniendo…' : b === 'start' ? 'Iniciando…' : 'Eliminando…'}
                  </div>
                ) : (
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={async () => {
                        if (!onStop) return;
                        try {
                          setBusy((p) => ({ ...p, [s.id]: 'stop' }));
                          await onStop();
                        } finally {
                          setBusy((p) => ({ ...p, [s.id]: null }));
                        }
                      }}
                      disabled={!canStop}
                      title={canStop ? 'Detener servidor' : 'Solo disponible cuando está RUNNING'}
                      className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-800 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Detener
                    </button>

                    <button
                      type="button"
                      onClick={async () => {
                        if (!onStart) return;
                        try {
                          setBusy((p) => ({ ...p, [s.id]: 'start' }));
                          await onStart();
                        } finally {
                          setBusy((p) => ({ ...p, [s.id]: null }));
                        }
                      }}
                      disabled={!canStart}
                      title={canStart ? 'Iniciar servidor' : 'Solo disponible cuando está OFFLINE'}
                      className="rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-semibold text-white shadow hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Iniciar
                    </button>

                    <button
                      type="button"
                      onClick={async () => {
                        if (!onDelete) return;
                        if (!canDelete) return;
                        if (!confirm(`¿Eliminar "${s.name}"?`)) return;
                        try {
                          setBusy((p) => ({ ...p, [s.id]: 'delete' }));
                          await onDelete();
                        } finally {
                          setBusy((p) => ({ ...p, [s.id]: null }));
                        }
                      }}
                      disabled={!canDelete}
                      title={canDelete ? 'Eliminar servidor' : 'Solo disponible cuando está OFFLINE'}
                      className="rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold text-white shadow hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Eliminar
                    </button>
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
