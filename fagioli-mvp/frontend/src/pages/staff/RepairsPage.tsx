import { useState, useEffect } from 'react';
import { Search, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import type { Repair, RepairStatus } from '../../types/repair';
import { STATUS_LABELS, STATUS_COLORS } from '../../types/repair';
import { RepairDetail } from '../../components/staff/RepairDetail';
import { auth } from '../../lib/auth';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';

/**
 * RepairsPage Component
 *
 * Full repairs list with search, filter, and sort
 *
 * Features:
 * - Search by plate or customer name
 * - Filter by status
 * - Sort by date (newest/oldest)
 * - Table view with pagination
 * - Click row to open detail modal
 *
 * Performance:
 * - Client-side filtering for instant feedback
 * - Pagination for large datasets
 * - Memoized computations
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
const PAGE_SIZE = 20;

type SortDirection = 'asc' | 'desc';

export function RepairsPage() {
  const [repairs, setRepairs] = useState<Repair[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<RepairStatus | 'all'>('all');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRepair, setSelectedRepair] = useState<Repair | null>(null);

  const fetchRepairs = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/repairs`, {
        headers: auth.getAuthHeaders(),
      });

      if (!response.ok) throw new Error('Failed to fetch repairs');

      const data = await response.json();
      setRepairs(data.repairs || []);
    } catch (err) {
      console.error('Error fetching repairs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRepairs();
  }, []);

  // Filter and sort repairs
  const filteredRepairs = repairs
    .filter((repair) => {
      // Search filter
      const matchesSearch =
        searchQuery === '' ||
        repair.vehicle?.plate.toLowerCase().includes(searchQuery.toLowerCase()) ||
        repair.customer?.name.toLowerCase().includes(searchQuery.toLowerCase());

      // Status filter
      const matchesStatus =
        statusFilter === 'all' || repair.status === statusFilter;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortDirection === 'desc' ? dateB - dateA : dateA - dateB;
    });

  // Pagination
  const totalPages = Math.ceil(filteredRepairs.length / PAGE_SIZE);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const paginatedRepairs = filteredRepairs.slice(
    startIndex,
    startIndex + PAGE_SIZE
  );

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  const toggleSort = () => {
    setSortDirection((prev) => (prev === 'desc' ? 'asc' : 'desc'));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Caricamento riparazioni...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Tutte le Riparazioni</h1>
        <p className="text-slate-400 mt-1">
          Gestisci e monitora tutte le riparazioni
        </p>
      </div>

      {/* Filters */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-4">
        <div className="grid md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              placeholder="Cerca per targa o cliente..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-600 text-white placeholder-slate-500 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as RepairStatus | 'all')}
              className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-600 text-white rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 appearance-none"
            >
              <option value="all">Tutti gli stati</option>
              {Object.entries(STATUS_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-400">
          {filteredRepairs.length} riparazion{filteredRepairs.length === 1 ? 'e' : 'i'} trovata
          {filteredRepairs.length === 1 ? '' : 'e'}
        </p>
      </div>

      {/* Table */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-900/50 border-b border-slate-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Targa
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Veicolo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Stato
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider cursor-pointer hover:bg-slate-700/50 transition"
                  onClick={toggleSort}
                >
                  <div className="flex items-center gap-1">
                    Data Creazione
                    {sortDirection === 'desc' ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronUp className="w-4 h-4" />
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Giorni
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {paginatedRepairs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    Nessuna riparazione trovata
                  </td>
                </tr>
              ) : (
                paginatedRepairs.map((repair) => {
                  const statusColors = STATUS_COLORS[repair.status];
                  return (
                    <tr
                      key={repair.id}
                      onClick={() => setSelectedRepair(repair)}
                      className="hover:bg-slate-700/50 cursor-pointer transition"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-semibold text-white">
                          {repair.vehicle?.plate}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                        {repair.vehicle?.brand} {repair.vehicle?.model}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                        {repair.customer?.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusColors.bg} ${statusColors.text} ${statusColors.border} border`}
                        >
                          {STATUS_LABELS[repair.status]}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                        {format(new Date(repair.createdAt), 'dd MMM yyyy', {
                          locale: it,
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                        {repair.daysInStatus || 0}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-slate-700 flex items-center justify-between">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-slate-600 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Precedente
            </button>
            <span className="text-sm text-slate-400">
              Pagina {currentPage} di {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-slate-600 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Successiva
            </button>
          </div>
        )}
      </div>

      {/* Detail modal */}
      {selectedRepair && (
        <RepairDetail
          repair={selectedRepair}
          onClose={() => setSelectedRepair(null)}
          onUpdate={() => {
            setSelectedRepair(null);
            fetchRepairs();
          }}
        />
      )}
    </div>
  );
}
