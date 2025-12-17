import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { AlertCircle } from 'lucide-react';

/**
 * LoginForm Component
 *
 * Staff login form with email/password authentication
 *
 * Features:
 * - Form validation
 * - Error handling with visual feedback
 * - Loading state during submission
 * - Automatic redirect on success
 *
 * Accessibility:
 * - Proper label associations
 * - Error announcements
 * - Keyboard navigation
 */

export function LoginForm() {
  const navigate = useNavigate();
  const { login, loading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationError, setValidationError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setValidationError('');

    // Basic validation
    if (!email || !password) {
      setValidationError('Email and password are required');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setValidationError('Please enter a valid email address');
      return;
    }

    try {
      await login({ email, password });
      // On success, redirect to dashboard
      navigate('/staff');
    } catch (err) {
      // Error is handled by useAuth hook
      console.error('Login error:', err);
    }
  };

  const displayError = validationError || error;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-md">
      {/* Error message */}
      {displayError && (
        <div
          className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-start gap-3"
          role="alert"
          aria-live="polite"
        >
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p className="text-sm">{displayError}</p>
        </div>
      )}

      {/* Email input */}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          placeholder="tuo@email.com"
          disabled={loading}
        />
      </div>

      {/* Password input */}
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          placeholder="••••••••"
          disabled={loading}
        />
      </div>

      {/* Submit button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-lg transition duration-200 focus:ring-4 focus:ring-blue-300 focus:outline-none"
      >
        {loading ? 'Accesso in corso...' : 'Accedi'}
      </button>
    </form>
  );
}
