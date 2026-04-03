export interface UserProfile {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string | null;
  role: string;
  enabled?: boolean;
  createdAt?: string | null;
}
