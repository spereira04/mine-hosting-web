// src/presentation/components/ServerList.tsx
import React from 'react';
import type { Server } from '@domain/entities/Server';

const badge: Record<Server['status'], string> = {
  RUNNING: 'border border-emerald-200 bg-emerald-50 text-emerald-700',
  CREATING: 'border border-amber-200 bg-amber-50 text-amber-700',
  OFFLINE: 'border border-slate-200 bg-slate-50 text-slate-700',
  STARTING: 'border border-blue-200 bg-slate-50 text-blue-700',
  DELETING: 'border border-red-200 bg-red-50 text-red-700'
};

export const ServerList: React.FC<{ servers: Server[] }> = ({ servers }) => {
  if (!servers.length) return <div className="text-sm text-slate-600">No tenés un servidor todavía.</div>;

  return (
    <ul className="grid gap-3">
      {servers.map((s) => (
        <li key={s.id} className="rounded-xl border border-slate-200 bg-white/90 p-3 sm:p-4">
          <div className="flex items-center justify-between gap-3">
            <strong className="truncate">{s.name}</strong>
            <span className={`text-xs px-2 py-0.5 rounded-full ${badge[s.status]}`}>
              {s.status}
            </span>
          </div>

          <div className="mt-2 text-xs sm:text-sm text-slate-600 flex flex-wrap gap-x-3 gap-y-1">
            <span className="whitespace-nowrap">Región: {s.region.name}</span>
            {/*<span className="whitespace-nowrap">Versión: {s.version.label}</span>*/}
            <span className="whitespace-nowrap">IP: { s.ip ? `${s.ip}:25565` : '—' }</span>
            <span className="whitespace-nowrap">
              Iniciado: {new Date(s.createdAt).toLocaleString()}
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
};
