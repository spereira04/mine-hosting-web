import React, { useState } from 'react';
import type { NewServer } from '@domain/entities/Server';

type Props = {
  onCreate: (input: NewServer) => Promise<void>;
};

export const ServerForm: React.FC<Props> = ({ onCreate }) => {
  const [name, setName] = useState('');
  const [region, setRegion] = useState('us-east-1');
  const [version, setVersion] = useState('1.21');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await onCreate({ name, region, version });
      setName('');
    } catch (err: any) {
      setError(err?.message ?? 'Error al crear servidor');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={submit} className="grid gap-4">
      {/* Nombre */}
      <div className="flex items-center gap-3 text-sm">
        <label htmlFor="srv-name" className="w-28 shrink-0 whitespace-nowrap">
          Nombre
        </label>
        <input
          id="srv-name"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Mi servidor"
          required
          className="flex-1 min-w-0 rounded-md border border-slate-300 px-3 py-2 bg-white
                     focus:outline-none focus:ring-2 focus:ring-green-500/60 focus:border-green-500"
        />
      </div>

      {/* Región */}
      <div className="flex items-center gap-3 text-sm">
        <label htmlFor="srv-region" className="w-28 shrink-0 whitespace-nowrap">
          Región
        </label>
        <select
          id="srv-region"
          value={region}
          onChange={e => setRegion(e.target.value)}
          className="flex-1 min-w-0 rounded-md border border-slate-300 px-3 py-2 bg-white
                     focus:outline-none focus:ring-2 focus:ring-green-500/60 focus:border-green-500"
        >
          <option value="us-east-1">US East (N. Virginia)</option>
          <option value="sa-east-1">South America (São Paulo)</option>
          <option value="eu-west-1">EU (Ireland)</option>
        </select>
      </div>

      {/* Versión */}
      <div className="flex items-center gap-3 text-sm">
        <label htmlFor="srv-version" className="w-28 shrink-0 whitespace-nowrap">
          Versión
        </label>
        <select
          id="srv-version"
          value={version}
          onChange={e => setVersion(e.target.value)}
          className="flex-1 min-w-0 rounded-md border border-slate-300 px-3 py-2 bg-white
                     focus:outline-none focus:ring-2 focus:ring-green-500/60 focus:border-green-500"
        >
          <option value="1.21">1.21</option>
          <option value="1.20.6">1.20.6</option>
          <option value="1.19.4">1.19.4</option>
        </select>
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
