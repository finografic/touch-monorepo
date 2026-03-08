export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  role: 'public' | 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}
