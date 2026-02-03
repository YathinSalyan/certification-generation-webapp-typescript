import React from 'react';
import { Award, LogOut } from 'lucide-react';
import { useAuth } from '@hooks/useAuth';
import { Button } from '@components/ui';
import { APP_NAME } from '@utils/constants';

export const Header: React.FC = () => {
  const { logout, adminData } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Award className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">{APP_NAME}</h1>
              {adminData && (
                <p className="text-sm text-gray-600">Welcome, {adminData.fullName}</p>
              )}
            </div>
          </div>

          <Button variant="secondary" icon={<LogOut className="w-4 h-4" />} onClick={logout}>
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
};