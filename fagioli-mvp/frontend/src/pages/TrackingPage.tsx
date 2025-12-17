import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AlertCircle, Loader2 } from 'lucide-react';
import TrackingStatus from '../components/customer/TrackingStatus';
import { getRepairByTrackingCode } from '../lib/api';
import type { Repair } from '../types/repair';

/**
 * TrackingPage Component
 *
 * Customer-facing page for tracking repair status
 * - Extracts tracking code from URL params (/track/:code)
 * - Fetches repair data from API
 * - Displays loading spinner
 * - Shows error if repair not found
 * - Renders TrackingStatus component
 *
 * Mobile-first responsive design
 *
 * Usage: Navigate to /track/ABC123
 */
export default function TrackingPage() {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();

  const [repair, setRepair] = useState<Repair | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!code) {
      setError('Codice tracking mancante');
      setLoading(false);
      return;
    }

    // Fetch repair data
    const fetchRepair = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getRepairByTrackingCode(code) as Repair;
        setRepair(data);
      } catch (err) {
        if (err instanceof Error) {
          if (err.message.includes('404')) {
            setError('Riparazione non trovata. Verifica il codice tracking.');
          } else {
            setError('Errore nel caricamento dei dati. Riprova più tardi.');
          }
        } else {
          setError('Si è verificato un errore imprevisto.');
        }
        console.error('Error fetching repair:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRepair();

    // Optional: Auto-refresh every 30 seconds
    const interval = setInterval(fetchRepair, 30000);

    return () => clearInterval(interval);
  }, [code]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-gold-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-300 font-medium">Caricamento dati...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !repair) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-slate-800 rounded-xl shadow-xl border border-slate-700 p-6 text-center animate-fade-in">
          <div className="w-16 h-16 bg-rose-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-rose-500" />
          </div>

          <h1 className="text-xl font-bold text-white mb-2">
            Riparazione Non Trovata
          </h1>

          <p className="text-slate-300 mb-6">
            {error || 'Non è stato possibile trovare la riparazione con questo codice.'}
          </p>

          <div className="space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-gradient-to-r from-gold-600 via-gold-500 to-gold-600 hover:from-gold-500 hover:via-gold-400 hover:to-gold-500 text-slate-900 font-semibold py-3 px-4 rounded-lg transition-all duration-200 shadow-gold hover:shadow-gold-lg"
            >
              Riprova
            </button>

            <button
              onClick={() => navigate('/')}
              className="w-full bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
            >
              Torna alla Home
            </button>
          </div>

          {code && (
            <div className="mt-6 pt-6 border-t border-slate-700">
              <p className="text-sm text-slate-400 mb-2">Codice ricercato:</p>
              <code className="text-sm font-mono bg-slate-700 text-gold-400 px-3 py-1 rounded">
                {code}
              </code>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Success state - render tracking status
  return <TrackingStatus repair={repair} />;
}
