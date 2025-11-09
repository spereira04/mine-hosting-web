import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';

type Variant = 'success' | 'error' | 'info';
type Toast = {
  id: number;
  message: string;
  title?: string;
  variant: Variant;
  duration: number; // ms
};

type Ctx = {
  push: (message: string, opts?: { title?: string; variant?: Variant; duration?: number }) => number;
  success: (message: string, title?: string) => number;
  error: (message: string, title?: string) => number;
  info: (message: string, title?: string) => number;
  remove: (id: number) => void;
};

const ToastContext = createContext<Ctx | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const idRef = useRef(1);
  const timers = useRef<Record<number, number>>({});

  const remove = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    if (timers.current[id]) {
      window.clearTimeout(timers.current[id]);
      delete timers.current[id];
    }
  }, []);

  const push = useCallback<Ctx['push']>((message, opts) => {
    const id = idRef.current++;
    const toast: Toast = {
      id,
      message,
      title: opts?.title,
      variant: opts?.variant ?? 'info',
      duration: Math.max(1500, Math.min(opts?.duration ?? 3500, 10000)),
    };
    setToasts((prev) => [toast, ...prev]);
    timers.current[id] = window.setTimeout(() => remove(id), toast.duration);
    return id;
  }, [remove]);

  const success: Ctx['success'] = useCallback((message, title) => push(message, { title, variant: 'success' }), [push]);
  const error: Ctx['error'] = useCallback((message, title) => push(message, { title, variant: 'error' }), [push]);
  const info: Ctx['info'] = useCallback((message, title) => push(message, { title, variant: 'info' }), [push]);

  const value = useMemo<Ctx>(() => ({ push, success, error, info, remove }), [push, success, error, info, remove]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {/* Viewport */}
      <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[1000] mx-auto flex w-full max-w-md flex-col gap-2 px-4">
        {toasts.map((t) => {
          const cx =
            t.variant === 'success'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
              : t.variant === 'error'
              ? 'border-red-200 bg-red-50 text-red-900'
              : 'border-slate-200 bg-white text-slate-900';
          const icon =
            t.variant === 'success' ? (
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : t.variant === 'error' ? (
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M13 16h-1v-4h-1m1-4h.01M12 3a9 9 0 100 18 9 9 0 000-18z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            );

          return (
            <div
              key={t.id}
              role="status"
              aria-live="polite"
              className={`pointer-events-auto flex items-start gap-3 rounded-lg border p-3 shadow-md ring-1 ring-black/5 ${cx}`}
            >
              <div className="mt-0.5">{icon}</div>
              <div className="min-w-0 flex-1">
                {t.title && <div className="text-sm font-semibold">{t.title}</div>}
                <div className="text-sm">{t.message}</div>
              </div>
              <button
                aria-label="Cerrar"
                onClick={() => remove(t.id)}
                className="rounded p-1 text-slate-500 hover:bg-black/5"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): Ctx {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within <ToastProvider>');
  return ctx;
}
