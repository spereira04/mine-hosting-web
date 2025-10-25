import React from 'react';
export const SiteHeader: React.FC = () => (
  <header className="sticky top-0 z-20 backdrop-blur bg-white/60 border-b">
    <div className="max-w-[1100px] mx-auto py-3 px-4 flex items-center justify-center gap-2 font-extrabold text-lg text-slate-900">
      <span aria-hidden>⛏️</span>
      <span>Mine Hosting</span>
    </div>
  </header>
);
