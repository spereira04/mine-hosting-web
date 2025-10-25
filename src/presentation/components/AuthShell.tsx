import React from 'react';
import { Outlet } from 'react-router-dom';
import { Layout } from '@presentation/components/Layout';

export default function AuthShell() {

  return (
    <Layout>
      <div className="relative min-h-screen grid overflow-hidden">
        <div className="flex items-center justify-center p-6">
          <Outlet />
        </div>
      </div>
    </Layout>
  );
}
