import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '@presentation/routes/ProtectedRoute';
import LoginPage from '@presentation/pages/LoginPage';
import SignUpPage from '@presentation/pages/SignUpPage';
import DashboardPage from '@presentation/pages/DashboardPage';
import StorePage from '@presentation/pages/StorePage';
import AuthShell from '@presentation/components/AuthShell';
import ConfirmSignUpPage from '@presentation/pages/ConfirmSignUpPage';

const router = createBrowserRouter([
  {
    path: '/auth',
    element: <AuthShell />,
    children: [
      { index: true, element: <LoginPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'signin', element: <SignUpPage /> },
      { path: 'confirm', element: <ConfirmSignUpPage /> },
    ],
  },
  { path: '/login', element: <Navigate to="/auth/login" replace /> },
  { path: '/signin', element: <Navigate to="/auth/signin" replace /> },
  { path: '/confirm', element: <Navigate to="/auth/confirm" replace /> },

  { path: '/', element: <ProtectedRoute><DashboardPage /></ProtectedRoute> },
  { path: '/app', element: <ProtectedRoute><DashboardPage /></ProtectedRoute> },
  { path: '/store', element: <ProtectedRoute><StorePage /></ProtectedRoute> }
]);

export const AppRouter: React.FC = () => <RouterProvider router={router} />;
