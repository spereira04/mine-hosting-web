// src/presentation/components/ServerForm.tsx
import React, { useState } from 'react';
import { ServerResources } from '@domain/entities/ServerResources';
import { useAuth } from '@presentation/context/AuthContext';
import { Region } from '@domain/entities/Region';
import { Version } from '@domain/entities/Version';
import { Type } from '@domain/entities/Type';

type Props = {
  onCreate: (input: { serverName: string; regionId: string; versionId: string, type: Type }) => Promise<void> | void;
  serverResources: ServerResources;
  resourcesLoading?: boolean;
  resourcesError?: string | null;
  onRetryRegions?: () => void;
};

export const ServerForm: React.FC<Props> = ({ 
  onCreate,
  serverResources,
  resourcesLoading,
  resourcesError,
  onRetryRegions
}) => {
  const [serverName, setServerName] = useState('');
  const [region, setRegion] = useState('');
  const [version, setVersion] = useState('');
  const [type, setType] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const selectedType = serverResources.types.find(t => t.id === type);
      await onCreate({ serverName, regionId: region, versionId: version, type: selectedType! });
      setServerName('');
      setRegion('');
      setVersion('');
      setType('');
    } catch (err: any) {
      setError(err?.message ?? 'Error al crear servidor');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={submit} className="grid gap-4">
      <div className="grid gap-1 text-sm sm:flex sm:items-center sm:gap-3">
        <label htmlFor="srv-name" className="text-sm sm:w-28 sm:shrink-0 whitespace-nowrap">
          Nombre
        </label>
        <input
          id="srv-name"
          value={serverName}
          onChange={e => setServerName(e.target.value)}
          placeholder="Mi servidor"
          required
          className="w-full flex-1 min-w-0 rounded-md border border-slate-300 px-3 py-2 bg-white
                     focus:outline-none focus:ring-2 focus:ring-green-500/60 focus:border-green-500"
        />
      </div>

      <div className="grid gap-1 text-sm sm:flex sm:items-center sm:gap-3">
        <label htmlFor="srv-region" className="text-sm sm:w-28 sm:shrink-0 whitespace-nowrap">
          Región
        </label>

        {resourcesLoading ? (
          <div className="h-10 w-full animate-pulse rounded-md bg-slate-200" />
        ) : resourcesError ? (
          <div className="flex items-center gap-3">
            <span className="text-red-600 text-sm">{resourcesError}</span>
            {onRetryRegions && (
              <button
                type="button"
                onClick={onRetryRegions}
                className="text-sm underline text-slate-700"
              >
                Reintentar
              </button>
            )}
          </div>
        ) : (
          <select
            value={region}
            onChange={e => setRegion(e.target.value)}
            required
            className="w-full flex-1 min-w-0 rounded-md border border-slate-300 px-3 py-2 bg-white
                     focus:outline-none focus:ring-2 focus:ring-green-500/60 focus:border-green-500"
          >
            <option value="" disabled>Elegí una región…</option>
            {serverResources.regions.map(r => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>
        )}
      </div>

      {/* Versión */}
      <div className="grid gap-1 text-sm sm:flex sm:items-center sm:gap-3">
        <label htmlFor="srv-version" className="text-sm sm:w-28 sm:shrink-0 whitespace-nowrap">
          Versión
        </label>
        {resourcesLoading ? (
          <div className="h-10 w-full animate-pulse rounded-md bg-slate-200" />
        ) :
        <select
          id="srv-version"
          value={version}
          onChange={e => setVersion(e.target.value)}
          required
          className="w-full flex-1 min-w-0 rounded-md border border-slate-300 px-3 py-2 bg-white
                     focus:outline-none focus:ring-2 focus:ring-green-500/60 focus:border-green-500"
        >
          <option value="" disabled>Elegí una versión</option>
            {serverResources.versions.map(v => (
              <option key={v.id} value={v.id}>{v.label}</option>
            ))}
        </select>}
      </div>

      <div className="grid gap-1 text-sm sm:flex sm:items-center sm:gap-3">
        <label htmlFor="srv-version" className="text-sm sm:w-28 sm:shrink-0 whitespace-nowrap">
          Tamaño
        </label>
        {resourcesLoading ? (
          <div className="h-10 w-full animate-pulse rounded-md bg-slate-200" />
        ):
        <select
          id="srv-type"
          value={type}
          onChange={e => setType(e.target.value)}
          required
          className="w-full flex-1 min-w-0 rounded-md border border-slate-300 px-3 py-2 bg-white
                     focus:outline-none focus:ring-2 focus:ring-green-500/60 focus:border-green-500"
        >
          <option value="" disabled>Elegí un tamaño</option>
            {serverResources.types.map(t => (
              <option key={t.id} value={t.id}>{t.name + ' | ' + t.creditCost + ' c/h'}</option>
            ))}
        </select>}
      </div>

      {/* Error */}
      {error && (
        <div className="text-sm rounded-md border border-red-200 bg-red-50 text-red-700 px-3 py-2">
          {error}
        </div>
      )}

      {/* Submit */}
      <div className="pt-1">
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-md bg-green-600 px-4 py-2 font-bold text-white
                     shadow-[0_6px_16px_rgba(22,163,74,0.25)]
                     transition hover:-translate-y-[1px] disabled:opacity-65"
        >
          {submitting ? 'Creando...' : 'Crear servidor'}
        </button>
      </div>
    </form>
  );
};
