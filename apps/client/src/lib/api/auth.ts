export interface LoginCredentials {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
}

export const authApi = {
  async login(credentials: LoginCredentials) {
    const res = await fetch(`${process.env.API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
      credentials: 'include',
    });

    if (!res.ok) {
      throw new Error('Login failed');
    }

    return res.json();
  },

  async getUser() {
    const res = await fetch(`${process.env.API_URL}/auth/me`, {
      credentials: 'include',
    });

    if (!res.ok) {
      throw new Error('Failed to get user');
    }

    return res.json() as Promise<User>;
  },

  async logout() {
    const res = await fetch(`${process.env.API_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });

    if (!res.ok) {
      throw new Error('Logout failed');
    }
  },
};
