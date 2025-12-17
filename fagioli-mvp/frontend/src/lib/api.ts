import type {
  CheckinFormData,
  CheckinResponse,
  TrackingStatus,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

class ApiError extends Error {
  public status?: number;
  public data?: any;

  constructor(
    message: string,
    status?: number,
    data?: any
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      errorData.message || 'Request failed',
      response.status,
      errorData
    );
  }
  return response.json();
}

export async function submitCheckin(
  data: CheckinFormData
): Promise<CheckinResponse> {
  const response = await fetch(`${API_BASE_URL}/checkin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  return handleResponse<CheckinResponse>(response);
}

export async function uploadPhotos(
  files: File[]
): Promise<Array<{ url: string; thumbnailUrl: string }>> {
  const formData = new FormData();
  files.forEach((file, index) => {
    formData.append(`photo_${index}`, file);
  });

  const response = await fetch(`${API_BASE_URL}/photos/upload`, {
    method: 'POST',
    body: formData,
  });

  return handleResponse<Array<{ url: string; thumbnailUrl: string }>>(
    response
  );
}

export async function getTrackingStatus(
  trackingCode: string
): Promise<TrackingStatus> {
  const response = await fetch(
    `${API_BASE_URL}/tracking/${trackingCode}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  return handleResponse<TrackingStatus>(response);
}

// Mock implementation for development
export async function submitCheckinMock(
  _data: CheckinFormData
): Promise<CheckinResponse> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Generate mock tracking code
  const trackingCode = `CF${Date.now().toString(36).toUpperCase()}`;

  return {
    success: true,
    trackingCode,
    message: 'Check-in completato con successo',
  };
}

export async function uploadPhotosMock(
  files: File[]
): Promise<Array<{ url: string; thumbnailUrl: string }>> {
  // Simulate upload delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return files.map((file) => {
    const url = URL.createObjectURL(file);
    return {
      url,
      thumbnailUrl: url,
    };
  });
}

export async function getTrackingStatusMock(
  trackingCode: string
): Promise<TrackingStatus> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  return {
    trackingCode,
    status: 'confirmed',
    customer: {
      name: 'Mario Rossi',
      phone: '+39 333 1234567',
      email: 'mario.rossi@example.com',
    },
    vehicle: {
      plate: 'AB123CD',
      brand: 'Fiat',
      model: '500',
      year: 2020,
    },
    repair: {
      type: 'sinistro',
      status: 'confirmed',
      photos: [],
      preferredDate: '2025-12-20',
      preferredTime: '09:00',
    },
    timeline: [
      {
        status: 'pending',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        status: 'confirmed',
        timestamp: new Date().toISOString(),
        note: 'Appuntamento confermato',
      },
    ],
  };
}

// Get repair details by tracking code (public endpoint, no auth required)
export async function getRepairByTrackingCode(trackingCode: string) {
  const response = await fetch(
    `${API_BASE_URL}/track/${trackingCode}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  const data = await handleResponse<{ repair: any }>(response);
  return data.repair;
}
