export interface LoginPayload {
  email: string;
  password: string;
  isRemember?: boolean;
}

export interface LoginResponse {
  accessToken: string;
  user: User;
}

export interface User {
  id: string;
  userName: string;
  phone: string;
  avatarUrl?: string;
  email: string;
  roles: string[];
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}

export interface RegisterPayload {
  userName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}
