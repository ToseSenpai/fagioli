export interface Customer {
  id?: string;
  name: string;
  phone: string;
  email?: string;
}

export interface Vehicle {
  id?: string;
  plate: string;
  brand?: string;
  model?: string;
  year?: number;
}

export interface Photo {
  id?: string;
  type: 'front' | 'rear' | 'side' | 'detail' | 'damage';
  url: string;
  file?: File;
  thumbnailUrl?: string;
}

export interface InsuranceInfo {
  company: string;
  policyNumber: string;
  claimNumber?: string;
}

export type RepairType = 'sinistro' | 'estetica' | 'meccanica';

export type RepairStatus =
  | 'pending'
  | 'confirmed'
  | 'in_progress'
  | 'ready'
  | 'completed'
  | 'cancelled';

export interface Repair {
  id?: string;
  type: RepairType;
  description?: string;
  status: RepairStatus;
  insuranceInfo?: InsuranceInfo;
  photos: Photo[];
  preferredDate?: string;
  preferredTime?: string;
  estimatedCost?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CheckinFormData {
  customer: Customer;
  vehicle: Vehicle;
  repair: Repair;
}

export interface CheckinResponse {
  success: boolean;
  trackingCode: string;
  message?: string;
}

export interface TrackingStatus {
  trackingCode: string;
  status: RepairStatus;
  customer: Customer;
  vehicle: Vehicle;
  repair: Repair;
  timeline: Array<{
    status: RepairStatus;
    timestamp: string;
    note?: string;
  }>;
}
