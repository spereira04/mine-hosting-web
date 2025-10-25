import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ProtectedRoute } from '@presentation/routes/ProtectedRoute';
import LoginPage from '@presentation/pages/LoginPage';
import SignUpPage from '@presentation/pages/SignUpPage';
import DashboardPage from '@presentation/pages/DashboardPage';

const router = createBrowserRouter([
  { path: '/', element: <ProtectedRoute><DashboardPage /></ProtectedRoute> },
  { path: '/app', element: <ProtectedRoute><DashboardPage /></ProtectedRoute> },
  { path: '/login', element: <LoginPage /> },
  { path: '/signin', element: <SignUpPage /> }
]);

export const AppRouter: React.FC = () => <RouterProvider router={router} />;
