import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@presentation/context/AuthContext';

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      await login(email, password);
      nav('/app');
    } catch (err: any) {
      setError(err?.message ?? 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_10px_30px_rgba(0,0,0,0.10)]">
      <div className="mb-4">
        <h1 className="m-0 text-2xl font-bold">Bienvenido</h1>
        <p className="mt-1 text-sm text-slate-500">Entrá para administrar tus servidores de Minecraft.</p>
      </div>

      <form onSubmit={onSubmit} className="grid gap-3">
        <label className="grid gap-1 text-sm">
          <span>Email</span>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="steve@ejemplo.com"
            required
            className="w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500/60 focus:border-green-500 bg-white"
          />
        </label>

        <label className="grid gap-1 text-sm">
          <span>Contraseña</span>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500/60 focus:border-green-500 bg-white"
          />
        </label>

        {error && <div className="text-sm text-red-600">{error}</div>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-green-600 px-3 py-2 font-bold text-white shadow-[0_6px_16px_rgba(22,163,74,0.25)] transition hover:-translate-y-[1px] disabled:opacity-65"
        >
          {loading ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>

      <p className="mt-3 text-sm">
        ¿No tenés cuenta?{' '}
        <Link to="/auth/signin" className="text-blue-600 hover:underline">Crear una</Link>
      </p>
    </section>
  );
};

export default LoginPage;
