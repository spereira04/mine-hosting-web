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
    <form onSubmit={submit} style={{ display: 'grid', gap: 12, border: '1px solid #e5e7eb', padding: 16, borderRadius: 8 }}>
      <h3>Crear nuevo servidor</h3>
      <label>
        Nombre
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Mi servidor" required />
      </label>
      <label>
        Región
        <select value={region} onChange={e => setRegion(e.target.value)}>
          <option value="us-east-1">US East (N. Virginia)</option>
          <option value="sa-east-1">South America (São Paulo)</option>
          <option value="eu-west-1">EU (Ireland)</option>
        </select>
      </label>
      <label>
        Versión de Minecraft
        <select value={version} onChange={e => setVersion(e.target.value)}>
          <option value="1.21">1.21</option>
          <option value="1.20.6">1.20.6</option>
          <option value="1.19.4">1.19.4</option>
        </select>
      </label>

      {error && <div style={{ color: 'crimson' }}>{error}</div>}
      <button type="submit" disabled={submitting}>{submitting ? 'Creando...' : 'Crear servidor'}</button>
    </form>
  );
};
