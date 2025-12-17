import { Clock, User, Car } from 'lucide-react';
import type { Repair } from '../../types/repair';
import { STATUS_LABELS, STATUS_COLORS } from '../../types/repair';

/**
 * RepairCard Component
 *
 * Compact card showing key repair information
 * Used in pipeline view
 *
 * Props:
 * - repair: Repair data
 * - onClick: Handler for card click
 *
 * Features:
 * - Status badge with color coding
 * - Vehicle and customer info
 * - Time in current status
 * - Click to open details
 *
 * Accessibility:
 * - Button semantics with keyboard support
 * - Descriptive aria-label
 */

interface RepairCardProps {
  repair: Repair;
  onClick: () => void;
}

export function RepairCard({ repair, onClick }: RepairCardProps) {
  const statusColors = STATUS_COLORS[repair.status];
  const statusLabel = STATUS_LABELS[repair.status];

  // Calculate days in status display
  const daysText = repair.daysInStatus === 0
    ? 'Oggi'
    : repair.daysInStatus === 1
    ? '1 giorno'
    : `${repair.daysInStatus} giorni`;

  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-slate-800 rounded-lg border border-slate-700 p-4 hover:shadow-lg hover:shadow-gold-500/20 hover:border-gold-500 transition-all duration-200 focus:ring-2 focus:ring-gold-500 focus:outline-none animate-fade-in"
      aria-label={`Riparazione ${repair.vehicle?.plate}, ${repair.customer?.name}`}
    >
      {/* Status badge */}
      <div className="flex items-start justify-between mb-3">
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusColors.bg} ${statusColors.text} ${statusColors.border} border`}
        >
          {statusLabel}
        </span>
        <span className="text-xs text-slate-400 flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {daysText}
        </span>
      </div>

      {/* Vehicle info */}
      <div className="flex items-center gap-2 mb-2">
        <Car className="w-4 h-4 text-slate-500" />
        <div>
          <p className="font-semibold text-white">{repair.vehicle?.plate}</p>
          <p className="text-sm text-slate-300">
            {repair.vehicle?.brand} {repair.vehicle?.model}
          </p>
        </div>
      </div>

      {/* Customer info */}
      <div className="flex items-center gap-2 text-sm text-slate-300">
        <User className="w-4 h-4 text-slate-500" />
        <span>{repair.customer?.name}</span>
      </div>

      {/* Description preview */}
      {repair.description && (
        <p className="mt-3 text-sm text-slate-400 line-clamp-2">
          {repair.description}
        </p>
      )}

      {/* Estimated completion */}
      {repair.estimatedCompletion && (
        <div className="mt-3 pt-3 border-t border-slate-700">
          <p className="text-xs text-slate-400">
            Prevista:{' '}
            <span className="font-medium text-slate-300">
              {new Date(repair.estimatedCompletion).toLocaleDateString('it-IT')}
            </span>
          </p>
        </div>
      )}
    </button>
  );
}
