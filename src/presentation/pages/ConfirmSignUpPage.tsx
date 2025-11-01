import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@presentation/context/AuthContext';

const ConfirmSignUpPage: React.FC = () => {
  const { confirmSignup, resendSignupCode } = useAuth();
  const [sp] = useSearchParams();
  const nav = useNavigate();

  const [email, setEmail] = useState(sp.get('email') ?? '');
  const [code, setCode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => { setMsg(null); setErr(null); }, [email, code]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      setSubmitting(true);
      setErr(null);
      await confirmSignup(email.trim(), code.trim());
      setMsg('¡Cuenta confirmada! Ya podés iniciar sesión.');
      setTimeout(() => nav('/auth/login'), 900);
    } catch (e: any) {
      setErr(e?.message ?? 'No pudimos confirmar tu cuenta');
    } finally {
      setSubmitting(false);
    }
  }

  async function onResend() {
    try {
      setSubmitting(true);
      setErr(null);
      await resendSignupCode(email.trim());
      setMsg('Código reenviado. Revisá tu correo.');
    } catch (e: any) {
      setErr(e?.message ?? 'No pudimos reenviar el código');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-64px)] grid place-items-center px-4 py-8">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-xl">
        <h1 className="text-xl font-bold mb-1">Confirmar cuenta</h1>
        <p className="text-slate-600 text-sm mb-4">
          Ingresá el <strong>código</strong> que te enviamos por email.
        </p>

        <form onSubmit={onSubmit} className="grid gap-3">
          <label className="grid gap-1">
            <span className="text-sm text-slate-700">Email</span>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500/60"
            />
          </label>

          <label className="grid gap-1">
            <span className="text-sm text-slate-700">Código</span>
            <input
              inputMode="numeric"
              value={code}
              onChange={e => setCode(e.target.value)}
              placeholder="123456"
              required
              className="rounded-md border border-slate-300 px-3 py-2 tracking-widest focus:outline-none focus:ring-2 focus:ring-green-500/60"
            />
          </label>

          {err && <div className="text-sm text-red-600">{err}</div>}
          {msg && <div className="text-sm text-green-700">{msg}</div>}

          <button
            type="submit"
            disabled={submitting}
            className="mt-1 rounded-md bg-green-600 px-4 py-2.5 font-bold text-white shadow-[0_6px_16px_rgba(22,163,74,0.25)] hover:-translate-y-[1px] active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-green-500/60 disabled:opacity-60"
          >
            {submitting ? 'Confirmando…' : 'Confirmar'}
          </button>

          <button
            type="button"
            onClick={onResend}
            disabled={submitting || !email}
            className="text-sm text-slate-700 underline justify-self-start disabled:opacity-60"
          >
            Reenviar código
          </button>
        </form>

        <div className="mt-4 text-sm">
          <Link to="/auth/login" className="text-slate-700 underline">Volver al login</Link>
        </div>
      </div>
    </div>
  );
};

export default ConfirmSignUpPage;
