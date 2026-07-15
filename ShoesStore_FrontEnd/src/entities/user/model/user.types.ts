export interface User {
  id: string;
  fullName?: string;
  userName: string;
  email: string;
  emailConfirmed: boolean;
  phone: string;
  avatarUrl?: string;
  roles: string[];
  birthDate?: string;
}
