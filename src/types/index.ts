export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // in minutes
  category: ServiceCategory;
  image?: string;
  popular?: boolean;
}

export type ServiceCategory = 
  | 'trancas' 
  | 'quimica';

export interface Professional {
  id: string;
  name: string;
  role: string;
  specialties: ServiceCategory[];
  avatar?: string;
  rating: number;
  reviewCount: number;
  bio: string;
  schedule: ProfessionalSchedule;
}

export interface ProfessionalSchedule {
  [day: string]: { start: string; end: string } | null; // day: 0-6 (Sun-Sat)
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
  notes?: string;
  createdAt: string;
  lastVisit?: string;
  totalVisits: number;
  totalSpent: number;
  preferences?: string[];
}

export interface Appointment {
  id: string;
  clientId: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  serviceIds: string[];
  serviceNames: string[];
  professionalId?: string;
  professionalName?: string;
  date: string; // ISO date string (YYYY-MM-DD)
  time: string; // HH:mm
  duration: number; // total minutes
  totalPrice: number;
  status: AppointmentStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  confirmationCode: string;
}

export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface TimeSlot {
  time: string;
  available: boolean;
  professionalId?: string;
}

export interface DaySchedule {
  date: string;
  slots: TimeSlot[];
  appointments: Appointment[];
}

export interface DashboardMetrics {
  todayRevenue: number;
  monthRevenue: number;
  todayAppointments: number;
  monthAppointments: number;
  newClientsThisMonth: number;
  totalClients: number;
  occupancyRate: number;
}

export interface CategoryInfo {
  id: ServiceCategory;
  name: string;
  icon: string;
  description: string;
  color: string;
  gradient: string;
}

export const CATEGORIES: CategoryInfo[] = [
  { id: 'trancas', name: 'Tranças & Nagôs', icon: '/icons/nago-icon.png', description: 'Tranças nagô, soltas e penteados', color: 'champagne', gradient: 'from-champagne-500 to-champagne-300' },
  { id: 'quimica', name: 'Química & Alisamentos', icon: '/icons/Gemini_Generated_Image_jyakp5jyakp5jyak.jpg', description: 'Escovas, progressivas, botox e cortes', color: 'roseGold', gradient: 'from-roseGold-500 to-roseGold-300' },
];

export const STATUS_LABELS: Record<AppointmentStatus, string> = {
  pending: 'Pendente',
  confirmed: 'Confirmado',
  completed: 'Finalizado',
  cancelled: 'Cancelado',
};

export const STATUS_COLORS: Record<AppointmentStatus, string> = {
  pending: 'status-pending',
  confirmed: 'status-confirmed',
  completed: 'status-completed',
  cancelled: 'status-cancelled',
};
