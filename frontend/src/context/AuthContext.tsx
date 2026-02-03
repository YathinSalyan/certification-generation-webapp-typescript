import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { AuthContextType, AdminProfile } from '@types/index';
import { apiService } from '@api/apiService';
import { StorageUtils } from '@utils/storageUtils';

export const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminData, setAdminData] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if token exists and validate it
    const initializeAuth = async () => {
      const token = StorageUtils.getAdminToken();

      if (token) {
        try {
          const response = await apiService.getAdminProfile();
          setAdminData(response.data);
          setIsAuthenticated(true);
        } catch (error) {
          // Token is invalid or expired
          StorageUtils.removeAdminToken();
          setIsAuthenticated(false);
          setAdminData(null);
        }
      }

      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (username: string, password: string): Promise<void> => {
    try {
      // Login and get token
      const loginResponse = await apiService.adminLogin(username, password);
      const { accessToken } = loginResponse.data;

      // Store token
      StorageUtils.setAdminToken(accessToken);

      // Get admin profile
      const profileResponse = await apiService.getAdminProfile();
      setAdminData(profileResponse.data);
      setIsAuthenticated(true);
    } catch (error) {
      // Clear any stored token on login failure
      StorageUtils.removeAdminToken();
      throw error;
    }
  };

  const logout = (): void => {
    StorageUtils.removeAdminToken();
    setIsAuthenticated(false);
    setAdminData(null);
  };

  const value: AuthContextType = {
    isAuthenticated,
    adminData,
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};