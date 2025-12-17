// Repair types for customer tracking and staff dashboard

export type RepairStatus =
  | 'pre_checkin'
  | 'confirmed'
  | 'accepted'
  | 'disassembly'
  | 'bodywork'
  | 'painting'
  | 'reassembly'
  | 'quality_check'
  | 'ready'
  | 'delivered'
  | 'cancelled';

export interface Vehicle {
  id: string;
  plate: string;
  brand?: string;
  model?: string;
  year?: number;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
}

export interface StatusHistoryItem {
  id?: string;
  status: RepairStatus;
  changedAt: string;
  timestamp?: string; // Alias for compatibility
  note?: string;
  notes?: string; // Alias for compatibility
  changedBy?: string;
}

export interface Photo {
  id: string;
  url: string;
  thumbnailUrl?: string;
  uploadedAt?: string;
}

export interface Repair {
  id: string;
  trackingCode?: string;
  status: RepairStatus;
  repairType?: string;
  description?: string;
  estimatedCompletion?: string;
  actualCompletion?: string;
  notes?: string;
  internalNotes?: string;
  vehicle?: Vehicle;
  customer?: Customer;
  statusHistory: StatusHistoryItem[];
  photos?: Photo[];
  createdAt: string;
  updatedAt: string;
  daysInStatus?: number;
}

export interface TrackingStep {
  key: RepairStatus;
  label: string;
  description: string;
  completed: boolean;
  current: boolean;
  timestamp?: string;
}

// Staff-specific status labels
export const STATUS_LABELS: Record<RepairStatus, string> = {
  pre_checkin: 'Pre-Checkin',
  confirmed: 'Confermato',
  accepted: 'Accettato',
  disassembly: 'Smontaggio',
  bodywork: 'Carrozzeria',
  painting: 'Verniciatura',
  reassembly: 'Rimontaggio',
  quality_check: 'Controllo Qualità',
  ready: 'Pronta',
  delivered: 'Consegnata',
  cancelled: 'Annullata',
};

// Status colors for UI (Premium Dark theme)
export const STATUS_COLORS: Record<RepairStatus, { bg: string; text: string; border: string }> = {
  pre_checkin: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500/30' },
  confirmed: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30' },
  accepted: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30' },
  disassembly: { bg: 'bg-indigo-500/10', text: 'text-indigo-400', border: 'border-indigo-500/30' },
  bodywork: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30' },
  painting: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/30' },
  reassembly: { bg: 'bg-indigo-500/10', text: 'text-indigo-400', border: 'border-indigo-500/30' },
  quality_check: { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/30' },
  ready: { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/30' },
  delivered: { bg: 'bg-slate-500/10', text: 'text-slate-400', border: 'border-slate-500/30' },
  cancelled: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/30' },
};
