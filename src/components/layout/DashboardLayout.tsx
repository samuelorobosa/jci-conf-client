import { FC, ReactNode, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/auth';
import { Button } from '@/components/ui/button';
import { LogOut, Users, UserPlus } from 'lucide-react';
import { AddAdminForm } from '@/components/admin/AddAdminForm';

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout: FC<DashboardLayoutProps> = ({
  children,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuthStore();
  const [isAddAdminOpen, setIsAddAdminOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;
  const isSuperAdmin = user?.role === 'SUPER_ADMIN';

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-xl font-bold">
                  JCI Conference Management
                </h1>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8 sm:items-center">
                <Button
                  variant={
                    isActive('/delegates') ? 'default' : 'ghost'
                  }
                  onClick={() => navigate('/delegates')}
                  className="flex items-center space-x-2"
                >
                  <Users className="h-5 w-5" />
                  <span>Delegates</span>
                </Button>
                {/* <Button
                  variant={
                    isActive('/trainings') ? 'default' : 'ghost'
                  }
                  onClick={() => navigate('/trainings')}
                  className="flex items-center space-x-2"
                >
                  <Calendar className="h-5 w-5" />
                  <span>Trainings</span>
                </Button> */}
                {isSuperAdmin && (
                  <Button
                    variant={
                      isActive('/admins') ? 'default' : 'ghost'
                    }
                    onClick={() => navigate('/admins')}
                    className="flex items-center space-x-2"
                  >
                    <UserPlus className="h-5 w-5" />
                    <span>Admins</span>
                  </Button>
                )}
              </div>
            </div>
            <div className="flex items-center">
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="flex items-center space-x-2"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>

      <AddAdminForm
        isOpen={isAddAdminOpen}
        onClose={() => setIsAddAdminOpen(false)}
      />
    </div>
  );
};
