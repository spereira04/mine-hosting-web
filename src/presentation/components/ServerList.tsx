import React from 'react';
import type { Server } from '@domain/entities/Server';

export const ServerList: React.FC<{ servers: Server[] }> = ({ servers }) => {
  if (!servers.length) return <div>No tenés servidores todavía.</div>;
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      {servers.map(s => (
        <div key={s.id} style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <strong>{s.name}</strong>
            <span>{s.status}</span>
          </div>
          <div style={{ fontSize: 14, color: '#374151' }}>
            Región: {s.region} • Versión: {s.version} • IP: {s.ip ?? '—'} • Creado: {new Date(s.createdAt).toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  );
};
