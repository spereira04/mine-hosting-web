// src/presentation/pages/StorePage.tsx
import React from 'react';
import { Layout } from '@presentation/components/Layout';

type Product = {
  id: string;
  credits: number;
  badge?: string;
  accent?: 'emerald' | 'sky' | 'amber';
  features: string[];
};

type Props = {
  onPurchase?: (productId: string) => void; // optional callback to integrate your checkout
};

const PRODUCTS: Product[] = [
  {
    id: 'credits_1k',
    credits: 1000,
    accent: 'sky',
    features: [
      'Recarga inmediata',
      'Usable en todos tus servidores',
      'Sin vencimiento',
    ],
  },
  {
    id: 'credits_5k',
    credits: 5000,
    badge: 'Más popular',
    accent: 'emerald',
    features: [
      'Mejor equilibrio precio/volumen',
      'Prioridad estándar de soporte',
      'Sin vencimiento',
    ],
  },
  {
    id: 'credits_10k',
    credits: 10000,
    badge: 'Mejor valor',
    accent: 'amber',
    features: [
      'Gran volumen para cargas intensivas',
      'Soporte priorizado',
      'Sin vencimiento',
    ],
  },
];

function cxAccent(accent: Product['accent']) {
  switch (accent) {
    case 'emerald':
      return 'ring-emerald-300/70';
    case 'sky':
      return 'ring-sky-300/70';
    case 'amber':
      return 'ring-amber-300/70';
    default:
      return 'ring-slate-200';
  }
}

export const StorePage: React.FC<Props> = ({ onPurchase }) => {
  function handleBuy(p: Product) {
    onPurchase?.(p.id);
    // Fallback while not integrated:
    if (!onPurchase) console.log('Buy product:', p.id);
  }

  return (
    <Layout>
      <main className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
        <header className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Tienda de créditos
          </h1>
          <p className="mt-1 text-slate-600">
            Elegí un paquete de créditos para ejecutar tus servidores de Minecraft.
          </p>
        </header>

        <section
          aria-label="Paquetes de créditos"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6"
        >
          {PRODUCTS.map((p) => (
            <article
              key={p.id}
              className={[
                'relative rounded-2xl border border-slate-200 bg-white/95 p-5 sm:p-6',
                'shadow-[0_10px_30px_rgba(0,0,0,0.08)] transition',
                'hover:shadow-[0_16px_36px_rgba(0,0,0,0.10)]',
                'ring-1', cxAccent(p.accent),
              ].join(' ')}
            >
              {p.badge && (
                <div className="absolute -top-2 right-4">
                  <span className="inline-flex items-center rounded-full bg-slate-900 text-white text-[10px] font-semibold px-2 py-1 shadow">
                    {p.badge}
                  </span>
                </div>
              )}

              <header className="mb-4">
                <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                  {p.credits.toLocaleString('es-AR')} <span className="text-base font-semibold text-slate-500">créditos</span>
                </div>
                <p className="text-sm text-slate-600 mt-1">
                  Recargá tu cuenta al instante.
                </p>
              </header>

              <ul className="mt-4 space-y-2 text-sm text-slate-700">
                {p.features.map((f, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <svg
                      aria-hidden
                      className="mt-0.5 h-4 w-4 flex-shrink-0"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6">
                <button
                  onClick={() => handleBuy(p)}
                  className="w-full rounded-md bg-green-600 px-4 py-2.5 font-bold text-white
                             shadow-[0_6px_16px_rgba(22,163,74,0.25)]
                             transition hover:-translate-y-[1px] active:translate-y-0
                             focus:outline-none focus:ring-2 focus:ring-green-500/60 focus:ring-offset-0"
                  aria-label={`Comprar paquete de ${p.credits} créditos`}
                >
                  Comprar
                </button>
              </div>
            </article>
          ))}
        </section>
      </main>
    </Layout>
  );
};

export default StorePage;
