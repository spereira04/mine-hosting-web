import React, { useEffect, useState, useCallback, version } from 'react';
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
import { StopServerUseCase } from '@application/usecases/StopServerUseCase';
import { DeleteServerUseCase } from '@application/usecases/DeleteServerUseCase';
import { StartServerUseCase } from '@application/usecases/StartServerUseCase';
import { useAuth } from '@presentation/context/AuthContext';
import { useToast } from '@presentation/components/ui/ToastProvider';
import { Version } from '@domain/entities/Version';
import { Type } from '@domain/entities/Type';

const serverRepo = new HttpServerRepository();

const DashboardPage: React.FC = () => {
  const [servers, setServers] = useState<Server[]>([]);
  const [loading, setLoading] = useState(true);
  const [generalError, setGeneralError] = useState<string | null>(null);

  const [serverLoading, setServerLoading] = useState(true);
  const [serverResources, setServerResources] = useState<ServerResources | null>(null);
  const [resourcesLoading, setResourcesLoading] = useState(true);
  const [resourcesError, setResourcesError] = useState<string | null>(null);

  const { user } = useAuth();
  const { success, error } = useToast();

  const loadPage = useCallback(async () => {
    setLoading(true);
    await loadServers();
    await loadResources();
    setLoading(false);
  }, []);

  const loadServers = useCallback(async () => {
    setServerLoading(true);
    setGeneralError(null);
    try {
      const uc = new GetServersUseCase(serverRepo);
      const list = await uc.execute(user!.email);
      setServers(list);
    } catch (err: any) {
      setGeneralError(err?.message ?? 'Error al cargar servidores');
    } finally {
      setServerLoading(false);
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

  useEffect(() => { 
    loadPage()
  }, [loadPage]);

  function errMsg(err: unknown): string {
    if (err instanceof Error && err.message) return err.message;
    if (typeof err === 'string') return err;
    return 'Unexpected error';
  }

  async function handleCreate(input: { serverName: string; regionId: string; versionId: string, typeId: string }) {
    try {
      const usecase = new CreateServerUseCase(serverRepo);
      const created = await usecase.execute({...input, owner: user!.email});
      setLoading(true);
      await new Promise(res => setTimeout(res, 2000));
      loadPage();
    } catch (e) {
      error(errMsg(e), 'No se pudo crear el servidor');
    } finally {
      setLoading(false);
    }
  }

  async function handleStop() {
    try {
      const uc = new StopServerUseCase(serverRepo);
      await uc.execute(user!.email);
      success('Deteniendo servidor', 'OK');
    } catch (e) {
      error(errMsg(e), 'No se pudo detener el servidor');
    }
  }

  async function handleDelete() {
    try {
      const usecase = new DeleteServerUseCase(serverRepo);
      await usecase.execute(user!.email);
      success('Borrando servidor', 'OK');
    } catch (e) {
      error(errMsg(e), 'No se pudo eliminar el servidor');
    }
  }

  async function handleStart() {
    try {
      const usecase = new StartServerUseCase(serverRepo);
      await usecase.execute(user!.email);
      success('Iniciando servidor', 'OK');
    } catch (e) {
      error(errMsg(e), 'No se pudo iniciar el servidor');
    }
  }

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
          { servers.length>0 ? (
          <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-[0_10px_30px_rgba(0,0,0,0.10)]">
            <h3 className="text-lg font-semibold mb-3">Mi servidor</h3>
            { generalError ? (
              <div className="text-red-600">{generalError}</div>
            ) : (
              <ServerList 
                servers={servers}
                onDelete={handleDelete}
                onStop={handleStop}
                onRefresh={loadServers}
                onStart={handleStart}
                refreshing={serverLoading}
              />
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
        </div>}
      </main>
    </Layout>
  );
};

export default DashboardPage;
