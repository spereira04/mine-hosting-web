import React from 'react';

export const SiteHeader: React.FC = () => {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <span className="brand-logo" aria-hidden>⛏️</span>
        <span className="brand-title">Mine Hosting</span>
      </div>
    </header>
  );
};
