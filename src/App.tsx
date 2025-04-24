import { FC, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';
import { DelegatesList } from '@/pages/delegates/DelegatesList';
import { TrainingsList } from '@/pages/trainings/TrainingsList';
import { useAuthStore } from '@/store/auth';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AdminsList } from '@/pages/admins/AdminsList';
import { Login } from '@/pages/auth/Login';

const queryClient = new QueryClient();

const PrivateRoute: FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

export const App: FC = () => {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <DashboardLayout>
                  <DelegatesList />
                </DashboardLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/admins"
            element={
              <PrivateRoute>
                <DashboardLayout>
                  <AdminsList />
                </DashboardLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/delegates"
            element={
              <PrivateRoute>
                <DelegatesList />
              </PrivateRoute>
            }
          />
          <Route
            path="/trainings"
            element={
              <PrivateRoute>
                <TrainingsList />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <DashboardLayout>
                  <Navigate to="/delegates" />
                </DashboardLayout>
              </PrivateRoute>
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Router>
      <Toaster position="top-right" />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};
