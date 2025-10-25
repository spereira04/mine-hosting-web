import React, { useEffect, useState } from 'react';
import { Layout } from '@presentation/components/Layout';
import { ServerForm } from '@presentation/components/ServerForm';
import { ServerList } from '@presentation/components/ServerList';
import type { Server } from '@domain/entities/Server';
import { HttpServerRepository } from '@infrastructure/repositories/HttpServerRepository';
import { CreateServerUseCase } from '@application/usecases/CreateServerUseCase';
import { GetServersUseCase } from '@application/usecases/GetServersUseCase';

const serverRepo = new HttpServerRepository();

const DashboardPage: React.FC = () => {
  const [servers, setServers] = useState<Server[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const usecase = new GetServersUseCase(serverRepo);
      const list = await usecase.execute();
      setServers(list);
    } catch (err: any) {
      setError(err?.message ?? 'Error al cargar servidores');
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(input: { name: string; region: string; version: string }) {
    const usecase = new CreateServerUseCase(serverRepo);
    const created = await usecase.execute(input);
    setServers(prev => [created, ...prev]);
  }

  useEffect(() => { load(); }, []);

  return (
    <Layout>
      <h2 style={{ marginBottom: 12 }}>Tus servidores</h2>
      <div style={{ display: 'grid', gap: 16, gridTemplateColumns: '1fr' }}>
        <ServerForm onCreate={handleCreate} />
        {loading ? <div>Cargando...</div> : error ? <div style={{ color: 'crimson' }}>{error}</div> : <ServerList servers={servers} />}
      </div>
    </Layout>
  );
};

export default DashboardPage;
