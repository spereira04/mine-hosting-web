import React, { useEffect, useState, useCallback } from 'react';
import { Layout } from '@presentation/components/Layout';
import { ServerForm } from '@presentation/components/ServerForm';
import { ServerList } from '@presentation/components/ServerList';
import type { Server } from '@domain/entities/Server';
import { HttpServerRepository } from '@infrastructure/repositories/HttpServerRepository';
import { DummyServerRepository } from '@infrastructure/repositories/DummyServerRepository';
import { CreateServerUseCase } from '@application/usecases/CreateServerUseCase';
import { GetServersUseCase } from '@application/usecases/GetServersUseCase';
import { GetServerRegionsUseCase } from '@application/usecases/GetServerRegionsUseCase';

const serverRepo = new DummyServerRepository();

const DashboardPage: React.FC = () => {
  const [servers, setServers] = useState<Server[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [regions, setRegions] = useState<Region[]>([]);
  const [regionsLoading, setRegionsLoading] = useState(true);
  const [regionsError, setRegionsError] = useState<string | null>(null);

  const loadServers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const uc = new GetServersUseCase(serverRepo);
      const list = await uc.execute();
      setServers(list);
    } catch (err: any) {
      setError(err?.message ?? 'Error al cargar servidores');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadRegions = useCallback(async () => {
    setRegionsLoading(true);
    setRegionsError(null);
    try {
      const uc = new GetServerRegionsUseCase(serverRepo);
      const list = await uc.execute();
      console.log(list);
      setRegions(list);
    } catch (err: any) {
      setRegionsError(err?.message ?? 'No se pudieron cargar las regiones');
    } finally {
      setRegionsLoading(false);
    }
  }, []);

  async function handleCreate(input: { name: string; region: string; version: string }) {
    const usecase = new CreateServerUseCase(serverRepo);
    const created = await usecase.execute(input);
    setServers(prev => [created, ...prev]);
  }

  async function obtainAvailableRegions() {
    const usecase = new GetServerRegionsUseCase(serverRepo);
    const created = await usecase.execute();

  }

  useEffect(() => { 
    loadServers(); 
    loadRegions();
  }, [loadServers, loadRegions]);

  return (
    <Layout>
      <main className="mx-auto w-full max-w-5xl px-4 py-4 sm:px-6 sm:py-6 overflow-x-clip">

        <div className="grid gap-6 lg:grid-cols-1">
          {/* Card: Crear servidor */}
          <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-[0_10px_30px_rgba(0,0,0,0.10)]">
            <h3 className="text-lg font-semibold mb-3">Crear nuevo servidor</h3>
            <ServerForm
              onCreate={handleCreate}
              regions={regions}
              regionsLoading={regionsLoading}
              regionsError={regionsError}
              onRetryRegions={loadRegions}
            />
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
