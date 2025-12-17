import { useState } from 'react';
import type { Repair, RepairStatus } from '../../types/repair';
import { STATUS_LABELS } from '../../types/repair';
import { RepairCard } from './RepairCard';
import { RepairDetail } from './RepairDetail';

/**
 * RepairPipeline Component
 *
 * Kanban-style pipeline view of repairs organized by status
 *
 * Features:
 * - Columns for key workflow statuses
 * - Count badges on column headers
 * - Drag-and-drop ready structure
 * - Click card to open detail modal
 * - Responsive horizontal scroll on mobile
 *
 * Statuses shown:
 * - Pre-Checkin (pending confirmation)
 * - Bodywork (carrozzeria work)
 * - Painting (verniciatura)
 * - Ready (pronte per ritiro)
 */

interface RepairPipelineProps {
  repairs: Repair[];
  onRepairUpdate?: () => void;
}

// Pipeline columns configuration
const PIPELINE_COLUMNS: RepairStatus[] = [
  'pre_checkin',
  'bodywork',
  'painting',
  'ready',
];

export function RepairPipeline({ repairs, onRepairUpdate }: RepairPipelineProps) {
  const [selectedRepair, setSelectedRepair] = useState<Repair | null>(null);

  // Group repairs by status
  const repairsByStatus = PIPELINE_COLUMNS.reduce((acc, status) => {
    acc[status] = repairs.filter((r) => r.status === status);
    return acc;
  }, {} as Record<RepairStatus, Repair[]>);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {PIPELINE_COLUMNS.map((status) => {
          const columnRepairs = repairsByStatus[status] || [];
          const count = columnRepairs.length;

          return (
            <div key={status} className="flex flex-col animate-fade-in-up">
              {/* Column header */}
              <div className="mb-4 pb-3 border-b-2 border-gold-500">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gold-400">
                    {STATUS_LABELS[status]}
                  </h3>
                  <span className="inline-flex items-center justify-center w-6 h-6 bg-gold-500/20 text-gold-400 text-xs font-medium rounded-full border border-gold-500/30">
                    {count}
                  </span>
                </div>
              </div>

              {/* Cards */}
              <div className="space-y-3 flex-1">
                {columnRepairs.length === 0 ? (
                  <div className="text-center py-8 text-slate-500 text-sm">
                    Nessuna riparazione
                  </div>
                ) : (
                  columnRepairs.map((repair) => (
                    <RepairCard
                      key={repair.id}
                      repair={repair}
                      onClick={() => setSelectedRepair(repair)}
                    />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail modal */}
      {selectedRepair && (
        <RepairDetail
          repair={selectedRepair}
          onClose={() => setSelectedRepair(null)}
          onUpdate={() => {
            setSelectedRepair(null);
            onRepairUpdate?.();
          }}
        />
      )}
    </>
  );
}
