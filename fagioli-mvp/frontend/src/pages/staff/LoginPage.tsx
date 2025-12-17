import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginForm } from '../../components/staff/LoginForm';
import { useAuth } from '../../hooks/useAuth';
import { Wrench } from 'lucide-react';

/**
 * LoginPage Component
 *
 * Staff authentication page for Carrozzeria Fagioli
 * Premium Dark theme with gold accents
 * Redirects to dashboard if already authenticated
 */

export function LoginPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/staff', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">
        {/* Logo and header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gold-500 rounded-full mb-4 shadow-lg shadow-gold-500/20 animate-scale-in">
            <Wrench className="w-8 h-8 text-slate-900" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Carrozzeria Fagioli
          </h1>
          <p className="text-slate-400">
            Area Staff - Gestione Riparazioni
          </p>
        </div>

        {/* Login form card */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-xl p-8 animate-scale-in">
          <LoginForm />
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-slate-400 mt-6">
          Accesso riservato al personale autorizzato
        </p>
      </div>
    </div>
  );
}
