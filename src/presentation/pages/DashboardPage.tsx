import React, { useEffect, useState, useCallback } from 'react';
import { Layout } from '@presentation/components/Layout';
import { ServerForm } from '@presentation/components/ServerForm';
import { ServerList } from '@presentation/components/ServerList';
import type { Server } from '@domain/entities/Server';
import type { Region } from '@domain/entities/Region';
import type { ServerResources } from '@domain/entities/ServerResources';
import { HttpServerRepository } from '@infrastructure/repositories/HttpServerRepository';
import { DummyServerRepository } from '@infrastructure/repositories/DummyServerRepository';
import { CreateServerUseCase } from '@application/usecases/CreateServerUseCase';
import { GetServerResourcesUseCase } from '@application/usecases/GetServerResourcesUseCase';
import { GetServersUseCase } from '@application/usecases/GetServersUseCase';

const serverRepo = new DummyServerRepository();

const DashboardPage: React.FC = () => {
  const [servers, setServers] = useState<Server[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [serverResources, setServerResources] = useState<ServerResources | null>(null);
  const [resourcesLoading, setResourcesLoading] = useState(true);
  const [resourcesError, setResourcesError] = useState<string | null>(null);

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

  const loadResources = useCallback(async () => {
    setResourcesLoading(true);
    setResourcesError(null);
    try {
      const uc = new GetServerResourcesUseCase(serverRepo);
      const resources = await uc.execute();
      setServerResources(resources);
    } catch (err: any) {
      setResourcesError(err?.message ?? 'No se pudieron cargar los recursos');
    } finally {
      setResourcesLoading(false);
    }
  }, []);

  async function handleCreate(input: { name: string; region: string; version: string, type: string }) {
    const usecase = new CreateServerUseCase(serverRepo);
    const created = await usecase.execute(input);
    setServers(prev => [created, ...prev]);
  }

  useEffect(() => { 
    loadServers(); 
    loadResources();
  }, [loadServers, loadResources]);

  return (
    <Layout>
      <main className="mx-auto w-full max-w-5xl px-4 py-4 sm:px-6 sm:py-6 overflow-x-clip">

        { loading ? 
        (
          <div className="grid min-h-[60vh] place-items-center">
            <div
              role="status"
              aria-live="polite"
              aria-busy="true"
              className="inline-flex items-center gap-3 rounded-xl border border-slate-200 bg-white/80 px-5 py-4 text-slate-700 shadow"
            >
              <svg
                className="h-8 w-8 animate-spin text-green-600"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden
              >
                <circle className="opacity-25" cx="12" cy="12" r="10"
                        stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
              <span className="text-lg font-semibold">Cargando…</span>
            </div>
          </div>
        )
        : 
        <div className="grid gap-6 lg:grid-cols-1">
          {/* Card: Crear servidor */}
          { servers.length>0 ? (
          <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-[0_10px_30px_rgba(0,0,0,0.10)]">
            <h3 className="text-lg font-semibold mb-3">Listado</h3>
            { error ? (
              <div className="text-red-600">{error}</div>
            ) : (
              <ServerList servers={servers} />
            )}
          </section>) 
          : 
          (
          <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-[0_10px_30px_rgba(0,0,0,0.10)]">
            <h3 className="text-lg font-semibold mb-3">Crear nuevo servidor</h3>
            <ServerForm
              onCreate={handleCreate}
              serverResources={serverResources!}
              resourcesLoading={resourcesLoading}
              resourcesError={resourcesError}
              onRetryRegions={loadResources}
            />
          </section>
          )}

          {/* Card: Listado */}
          
        </div>}
      </main>
    </Layout>
  );
};

export default DashboardPage;
