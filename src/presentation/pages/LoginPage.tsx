import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@presentation/context/AuthContext';
import { SiteHeader } from '@presentation/components/SiteHeader';

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
    <div className="auth-page">
      <SiteHeader />

      {/* Fondo con imagen + blur */}
      <div className="auth-bg" aria-hidden>
        <img src="/images/minecraft_landscape.jpg" alt="" />
        <div className="auth-scrim" />
      </div>

      <div className="auth-content">
        <section className="auth-card">
          <div className="auth-card__header">
            <h1>Bienvenido</h1>
            <p>Entrá para administrar tus servidores de Minecraft.</p>
          </div>

          <form onSubmit={onSubmit} className="auth-form">
            <label>
              Email
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="steve@ejemplo.com"
                required
              />
            </label>

            <label>
              Contraseña
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </label>

            {error && <div className="form-error">{error}</div>}

            <button type="submit" className="btn primary" disabled={loading}>
              {loading ? 'Ingresando...' : 'Ingresar'}
            </button>
          </form>

          <p className="auth-alt">
            ¿No tenés cuenta? <Link to="/signin">Crear una</Link>
          </p>
        </section>
      </div>
    </div>
  );
};

export default LoginPage;
