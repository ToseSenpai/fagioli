import { useState, useEffect } from 'react';
import { StatsCards } from '../../components/staff/StatsCards';
import { RepairPipeline } from '../../components/staff/RepairPipeline';
import type { Repair } from '../../types/repair';
import { auth } from '../../lib/auth';
import { RefreshCw } from 'lucide-react';

/**
 * DashboardPage Component
 *
 * Main staff dashboard with overview and pipeline
 *
 * Features:
 * - Key metrics stats cards
 * - Kanban pipeline view
 * - Auto-refresh every 30 seconds
 * - Manual refresh button
 *
 * Performance:
 * - Optimistic UI updates
 * - Loading states
 * - Error handling
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
const REFRESH_INTERVAL = 30000; // 30 seconds

export function DashboardPage() {
  const [repairs, setRepairs] = useState<Repair[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchRepairs = async (showRefreshing = false) => {
    if (showRefreshing) setIsRefreshing(true);

    try {
      const response = await fetch(`${API_URL}/repairs`, {
        headers: auth.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch repairs');
      }

      const data = await response.json();
      setRepairs(data.repairs || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching repairs:', err);
      setError('Errore nel caricamento delle riparazioni');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchRepairs();
  }, []);

  // Auto-refresh
  useEffect(() => {
    const interval = setInterval(() => {
      fetchRepairs();
    }, REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  // Calculate stats
  const stats = {
    totalToday: repairs.filter(
      (r) =>
        new Date(r.createdAt).toDateString() === new Date().toDateString() &&
        r.status !== 'cancelled' &&
        r.status !== 'delivered'
    ).length,
    pendingPreCheckin: repairs.filter((r) => r.status === 'pre_checkin').length,
    readyForPickup: repairs.filter((r) => r.status === 'ready').length,
    avgDaysInShop:
      repairs.length > 0
        ? Math.round(
            repairs.reduce((sum, r) => sum + (r.daysInStatus || 0), 0) / repairs.length
          )
        : 0,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-gold-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Caricamento dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 px-4 py-3 rounded-lg">
        <p>{error}</p>
        <button
          onClick={() => fetchRepairs(true)}
          className="mt-2 text-sm underline hover:no-underline text-rose-300"
        >
          Riprova
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-slate-400 mt-1">
            Panoramica riparazioni e statistiche
          </p>
        </div>
        <button
          onClick={() => fetchRepairs(true)}
          disabled={isRefreshing}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 border border-slate-700 text-slate-300 rounded-lg hover:bg-slate-700 hover:text-white transition disabled:opacity-50"
          aria-label="Aggiorna dati"
        >
          <RefreshCw
            className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`}
          />
          <span className="font-medium">Aggiorna</span>
        </button>
      </div>

      {/* Stats Cards */}
      <StatsCards stats={stats} />

      {/* Pipeline */}
      <div>
        <h2 className="text-xl font-bold text-white mb-6">
          Pipeline Riparazioni
        </h2>
        <RepairPipeline
          repairs={repairs.filter(
            (r) => r.status !== 'delivered' && r.status !== 'cancelled'
          )}
          onRepairUpdate={() => fetchRepairs(true)}
        />
      </div>
    </div>
  );
}
