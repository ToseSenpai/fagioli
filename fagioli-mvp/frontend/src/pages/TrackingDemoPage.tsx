import { useState } from 'react';
import TrackingStatus from '../components/customer/TrackingStatus';
import type { Repair, RepairStatus } from '../types/repair';

/**
 * TrackingDemoPage
 *
 * Development/demo page showing tracking component
 * with different mock repair statuses
 *
 * Usage: Navigate to /demo/tracking
 */
export default function TrackingDemoPage() {
  const [selectedStatus, setSelectedStatus] = useState<RepairStatus>('bodywork');

  // Mock repair data
  const createMockRepair = (status: RepairStatus): Repair => {
    const baseDate = new Date('2025-12-10T09:00:00');
    const statusHistory = [];

    // Add history entries based on current status
    const statusOrder: RepairStatus[] = [
      'accepted',
      'disassembly',
      'bodywork',
      'painting',
      'reassembly',
      'quality_check',
      'ready',
      'delivered',
    ];

    const currentIndex = statusOrder.indexOf(status);

    statusOrder.forEach((st, index) => {
      if (index < currentIndex) {
        statusHistory.push({
          id: `hist-${index}`,
          status: st,
          changedAt: new Date(baseDate.getTime() + index * 86400000).toISOString(),
        });
      }
    });

    // Add current status to history
    if (currentIndex >= 0) {
      statusHistory.push({
        id: `hist-current`,
        status,
        changedAt: new Date(baseDate.getTime() + currentIndex * 86400000).toISOString(),
      });
    }

    return {
      id: 'demo-repair-1',
      trackingCode: 'CF2024ABC',
      status,
      repairType: 'sinistro',
      estimatedCompletion: new Date('2025-12-25T18:00:00').toISOString(),
      actualCompletion: status === 'delivered' ? new Date().toISOString() : undefined,
      notes: 'Riparazione post sinistro stradale',
      vehicle: {
        id: 'veh-1',
        plate: 'AB123CD',
        brand: 'Fiat',
        model: '500',
        year: 2020,
      },
      customer: {
        id: 'cust-1',
        name: 'Mario Rossi',
        phone: '+39 333 1234567',
        email: 'mario.rossi@example.com',
      },
      statusHistory,
      createdAt: baseDate.toISOString(),
      updatedAt: new Date().toISOString(),
    };
  };

  const mockRepair = createMockRepair(selectedStatus);

  const statusOptions: Array<{ value: RepairStatus; label: string }> = [
    { value: 'pre_checkin', label: 'Pre Check-in' },
    { value: 'confirmed', label: 'Confermato' },
    { value: 'accepted', label: 'Accettato' },
    { value: 'disassembly', label: 'Smontaggio' },
    { value: 'bodywork', label: 'Carrozzeria' },
    { value: 'painting', label: 'Verniciatura' },
    { value: 'reassembly', label: 'Rimontaggio' },
    { value: 'quality_check', label: 'Controllo Qualità' },
    { value: 'ready', label: 'Pronta per Ritiro' },
    { value: 'delivered', label: 'Consegnata' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Demo controls */}
      <div className="bg-yellow-100 border-b-4 border-yellow-500 p-4 sticky top-0 z-50 shadow-md">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-lg font-bold text-yellow-900 mb-2">Demo Mode</h2>
          <div className="flex flex-wrap gap-2 items-center">
            <label htmlFor="status-select" className="text-sm font-medium text-yellow-900">
              Simula stato:
            </label>
            <select
              id="status-select"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as RepairStatus)}
              className="px-3 py-1.5 border border-yellow-600 rounded bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Render tracking component */}
      <TrackingStatus repair={mockRepair} />
    </div>
  );
}
