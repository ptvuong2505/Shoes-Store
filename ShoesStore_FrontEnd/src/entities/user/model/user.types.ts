export interface User {
  id: string;
  userName: string;
  phone: string;
  avatarUrl?: string;
  email: string;
  roles: string[];
  birthDate?: string;
}
