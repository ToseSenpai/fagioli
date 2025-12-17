// Auth utilities for staff authentication
// Handles JWT token storage and authentication checks

const TOKEN_KEY = 'fagioli_auth_token';
const USER_KEY = 'fagioli_auth_user';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'staff';
}

export const auth = {
  // Store JWT token in localStorage
  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  },

  // Retrieve JWT token from localStorage
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  // Remove token from localStorage
  removeToken(): void {
    localStorage.removeItem(TOKEN_KEY);
  },

  // Store user data in localStorage
  setUser(user: User): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  // Retrieve user data from localStorage
  getUser(): User | null {
    const userData = localStorage.getItem(USER_KEY);
    if (!userData) return null;
    try {
      return JSON.parse(userData);
    } catch {
      return null;
    }
  },

  // Remove user data from localStorage
  removeUser(): void {
    localStorage.removeItem(USER_KEY);
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token;
  },

  // Logout user - clear all auth data
  logout(): void {
    this.removeToken();
    this.removeUser();
  },

  // Get auth headers for API requests
  getAuthHeaders(): HeadersInit {
    const token = this.getToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  },
};
