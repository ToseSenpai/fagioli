import { useState, useEffect, useCallback } from 'react';
import { auth } from '../lib/auth';
import type { User } from '../lib/auth';

// API base URL - adjust based on environment
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: User;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize auth state on mount
  useEffect(() => {
    const initAuth = () => {
      if (auth.isAuthenticated()) {
        const userData = auth.getUser();
        setUser(userData);
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  // Login function
  const login = useCallback(async (credentials: LoginCredentials): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Login failed');
      }

      const data: LoginResponse = await response.json();

      // Store auth data
      auth.setToken(data.token);
      auth.setUser(data.user);
      setUser(data.user);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred during login';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Logout function
  const logout = useCallback(() => {
    auth.logout();
    setUser(null);
    setError(null);
  }, []);

  return {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated: auth.isAuthenticated(),
  };
}
