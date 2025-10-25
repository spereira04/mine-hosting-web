import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '@presentation/routes/ProtectedRoute';
import LoginPage from '@presentation/pages/LoginPage';
import SignUpPage from '@presentation/pages/SignUpPage';
import DashboardPage from '@presentation/pages/DashboardPage';
import AuthShell from '@presentation/components/AuthShell';

// const router = createBrowserRouter([
//   {
//     path: '/auth',
//     element: <AuthShell />,
//     children: [
//       { index: true, element: <LoginPage /> },
//       { path: 'login', element: <LoginPage /> },
//       { path: 'signin', element: <SignUpPage /> },
//     ],
//   },
//   { path: '/login', element: <Navigate to="/auth/login" replace /> },
//   { path: '/signin', element: <Navigate to="/auth/signin" replace /> },

//   { path: '/', element: <ProtectedRoute><DashboardPage /></ProtectedRoute> },
//   { path: '/app', element: <ProtectedRoute><DashboardPage /></ProtectedRoute> },
// ]);

// export const AppRouter: React.FC = () => <RouterProvider router={router} />;

const router = createBrowserRouter([
  {
    path: '/auth',
    element: <AuthShell />,
    children: [
      { index: true, element: <LoginPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'signin', element: <SignUpPage /> },
    ],
  },
  { path: '/login', element: <Navigate to="/auth/login" replace /> },
  { path: '/signin', element: <Navigate to="/auth/signin" replace /> },

  { path: '/', element: <DashboardPage /> },
  { path: '/app', element: <DashboardPage /> },
]);

export const AppRouter: React.FC = () => <RouterProvider router={router} />;
