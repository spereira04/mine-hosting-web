// src/presentation/pages/DashboardPage.tsx
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
  const [servers, setServers] = useState<Server[]>([
    {
      id: 'choripzo',
      name: 'choripzeano',
      region: 'us-east-1',
      version: '1.21',
      status: 'CREATING',
      ip: '192.168.0.10',
      createdAt: new Date().toISOString(),
    },
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      // const usecase = new GetServersUseCase(serverRepo);
      // const list = await usecase.execute();
      // setServers(list);
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
      <main className="mx-auto w-full max-w-5xl px-4 py-4 sm:px-6 sm:py-6 overflow-x-clip">

        <div className="grid gap-6 lg:grid-cols-1">
          {/* Card: Crear servidor */}
          <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-[0_10px_30px_rgba(0,0,0,0.10)]">
            <h3 className="text-lg font-semibold mb-3">Crear nuevo servidor</h3>
            <ServerForm onCreate={handleCreate} />
          </section>

          {/* Card: Listado */}
          <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-[0_10px_30px_rgba(0,0,0,0.10)]">
            <h3 className="text-lg font-semibold mb-3">Listado</h3>
            {loading ? (
              <div>Cargando...</div>
            ) : error ? (
              <div className="text-red-600">{error}</div>
            ) : (
              <ServerList servers={servers} />
            )}
          </section>
        </div>
      </main>
    </Layout>
  );
};

export default DashboardPage;
