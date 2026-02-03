export interface AdminProfile {
  adminId: string;
  username: string;
  email: string;
  fullName: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  adminData: AdminProfile | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}