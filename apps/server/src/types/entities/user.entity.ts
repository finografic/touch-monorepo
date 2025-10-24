export interface UserEntity {
  id: string;
  name: string;
  email: string;
  email_verified: boolean;
  image: string | null;
  role: 'public' | 'user' | 'admin';
  created_at: number;
  updated_at: number;
}
