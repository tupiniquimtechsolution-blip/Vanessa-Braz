import { Booking, Client } from './data';

const STORAGE_KEYS = {
  BOOKINGS: 'vb_bookings',
  CLIENT: 'vb_client',
  AUTH: 'vb_auth',
  ADMIN_AUTH: 'vb_admin_auth',
  CONSENT: 'vb_consent',
};

// Bookings
export function getBookings(): Booking[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveBooking(booking: Booking): void {
  const bookings = getBookings();
  bookings.push(booking);
  localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
}

export function updateBookingStatus(id: string, status: Booking['status']): void {
  const bookings = getBookings();
  const index = bookings.findIndex(b => b.id === id);
  if (index !== -1) {
    bookings[index].status = status;
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
  }
}

export function getBookingsByDate(date: string): Booking[] {
  return getBookings().filter(b => b.date === date && b.status !== 'cancelled');
}

export function getBookingsByClient(clientId: string): Booking[] {
  return getBookings().filter(b => b.id.startsWith(clientId));
}

// Check if time slot is available
export function isTimeSlotAvailable(date: string, time: string, serviceDuration: number): boolean {
  const bookings = getBookingsByDate(date);
  const serviceEndMinutes = timeToMinutes(time) + serviceDuration;
  const serviceStartMinutes = timeToMinutes(time);

  for (const booking of bookings) {
    const bookingStart = timeToMinutes(booking.time);
    const bookingEnd = bookingStart + getServiceDuration(booking.serviceId);
    
    // Check overlap
    if (serviceStartMinutes < bookingEnd && serviceEndMinutes > bookingStart) {
      return false;
    }
  }
  return true;
}

function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

function getServiceDuration(serviceId: string): number {
  // Duration mapping to avoid circular dependency
  const durations: Record<string, number> = {
    '1': 45, '2': 120, '3': 90, '4': 60,
    '5': 75, '6': 60, '7': 60, '8': 60,
  };
  return durations[serviceId] || 60;
}

// Client
export function getClient(): Client | null {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CLIENT);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function saveClient(client: Client): void {
  localStorage.setItem(STORAGE_KEYS.CLIENT, JSON.stringify(client));
}

// Auth
export function isAuthenticated(): boolean {
  return localStorage.getItem(STORAGE_KEYS.AUTH) === 'true';
}

export function setAuthenticated(value: boolean): void {
  if (value) {
    localStorage.setItem(STORAGE_KEYS.AUTH, 'true');
  } else {
    localStorage.removeItem(STORAGE_KEYS.AUTH);
  }
}

// Admin Auth
export function isAdminAuthenticated(): boolean {
  return localStorage.getItem(STORAGE_KEYS.ADMIN_AUTH) === 'true';
}

export function setAdminAuthenticated(value: boolean): void {
  if (value) {
    localStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, 'true');
  } else {
    localStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
  }
}

// Consent
export interface Consent {
  necessary: boolean;
  marketing: boolean;
  image: boolean;
  acceptedAt: string;
}

export function getConsent(): Consent | null {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CONSENT);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function saveConsent(consent: Consent): void {
  localStorage.setItem(STORAGE_KEYS.CONSENT, JSON.stringify(consent));
}

// Generate unique ID
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

// Format currency
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

// Format date
export function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;
}

// Generate available time slots for a date
export function generateTimeSlots(date: string): { time: string; available: boolean }[] {
  const dayOfWeek = new Date(date + 'T12:00:00').getDay();
  
  const hours: Record<number, { open: string; close: string } | null> = {
    0: null, // Sunday
    1: { open: '09:00', close: '19:00' },
    2: { open: '09:00', close: '19:00' },
    3: { open: '09:00', close: '19:00' },
    4: { open: '09:00', close: '20:00' },
    5: { open: '09:00', close: '20:00' },
    6: { open: '09:00', close: '16:00' },
  };

  const schedule = hours[dayOfWeek];
  if (!schedule) return [];

  const slots: { time: string; available: boolean }[] = [];
  const [openH, openM] = schedule.open.split(':').map(Number);
  const [closeH, closeM] = schedule.close.split(':').map(Number);
  
  let currentMinutes = openH * 60 + openM;
  const endMinutes = closeH * 60 + closeM;

  while (currentMinutes < endMinutes) {
    const h = Math.floor(currentMinutes / 60);
    const m = currentMinutes % 60;
    const time = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
    slots.push({ time, available: true });
    currentMinutes += 30; // 30-minute intervals
  }

  return slots;
}
