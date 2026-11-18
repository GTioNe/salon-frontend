import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Service, Professional, Client, Appointment, AppointmentStatus } from '../types';
import { MOCK_SERVICES, MOCK_PROFESSIONALS, MOCK_CLIENTS, MOCK_APPOINTMENTS } from '../data/mockData';

const getApiBase = () => {
  const envUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
  // Remove qualquer /api do final para não duplicar na montagem das rotas
  return envUrl.replace(/\/api\/?$/, '');
};

async function fetchApi<T>(url: string, options?: RequestInit): Promise<T> {
  const baseUrl = getApiBase();
  // Garante que url comece com /api
  const endpoint = url.startsWith('/api') ? url : `/api${url}`;
  const res = await fetch(`${baseUrl}${endpoint}`, {
    headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': '', ...options?.headers },
    ...options,
  });
  if (!res.ok) throw new Error(`API ${res.status}`);
  return res.json();
}

interface SalonState {
  // Data
  services: Service[];
  professionals: Professional[];
  clients: Client[];
  appointments: Appointment[];
  
  // UI State
  isDarkMode: boolean;
  sidebarOpen: boolean;
  
  // Actions - Services
  addService: (service: Omit<Service, 'id'>) => Service;
  updateService: (id: string, data: Partial<Service>) => void;
  deleteService: (id: string) => void;
  
  // Actions - Professionals
  addProfessional: (prof: Omit<Professional, 'id'>) => Professional;
  updateProfessional: (id: string, data: Partial<Professional>) => void;
  deleteProfessional: (id: string) => void;
  
  // Actions - Clients
  addClient: (client: Omit<Client, 'id' | 'createdAt' | 'totalVisits' | 'totalSpent'>) => Client;
  updateClient: (id: string, data: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  
  // Actions - Appointments
  addAppointment: (appointment: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt' | 'confirmationCode'>) => Appointment;
  updateAppointment: (id: string, data: Partial<Appointment>) => void;
  updateAppointmentStatus: (id: string, status: AppointmentStatus) => void;
  deleteAppointment: (id: string) => void;
  getAppointmentsByDate: (date: string) => Appointment[];
  getAppointmentsByProfessional: (professionalId: string, date: string) => Appointment[];
  getAvailableSlots: (date: string, professionalId?: string, duration?: number, serviceId?: string) => Promise<string[]>;
  
  // UI Actions
  toggleDarkMode: () => void;
  setSidebarOpen: (open: boolean) => void;
  
  // Computed
  getDashboardMetrics: () => {
    todayRevenue: number;
    monthRevenue: number;
    todayAppointments: number;
    monthAppointments: number;
    newClientsThisMonth: number;
    totalClients: number;
    occupancyRate: number;
  };
}

const generateId = () => `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
const generateConfirmationCode = () => `SLN-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

const today = new Date().toISOString().split('T')[0];
const thisMonth = new Date().toISOString().substring(0, 7);

export const useSalonStore = create<SalonState>()(
  persist(
    (set, get) => ({
      // Initial Data
      services: MOCK_SERVICES,
      professionals: MOCK_PROFESSIONALS,
      clients: MOCK_CLIENTS,
      appointments: MOCK_APPOINTMENTS,
      
      // UI State
      isDarkMode: false,
      sidebarOpen: false,
      
      // Services
      addService: (serviceData) => {
        const newService: Service = {
          ...serviceData,
          id: generateId(),
        };
        set((state) => ({ services: [...state.services, newService] }));
        return newService;
      },
      
      updateService: (id, data) => {
        set((state) => ({
          services: state.services.map((s) => (s.id === id ? { ...s, ...data } : s)),
        }));
      },
      
      deleteService: (id) => {
        set((state) => ({
          services: state.services.filter((s) => s.id !== id),
        }));
      },
      
      // Professionals
      addProfessional: (profData) => {
        const newProfessional: Professional = {
          ...profData,
          id: generateId(),
        };
        set((state) => ({ professionals: [...state.professionals, newProfessional] }));
        return newProfessional;
      },
      
      updateProfessional: (id, data) => {
        set((state) => ({
          professionals: state.professionals.map((p) => (p.id === id ? { ...p, ...data } : p)),
        }));
      },
      
      deleteProfessional: (id) => {
        set((state) => ({
          professionals: state.professionals.filter((p) => p.id !== id),
        }));
      },
      
      // Clients
      addClient: (clientData) => {
        const newClient: Client = {
          ...clientData,
          id: generateId(),
          createdAt: new Date().toISOString(),
          totalVisits: 0,
          totalSpent: 0,
        };
        set((state) => ({ clients: [...state.clients, newClient] }));
        return newClient;
      },
      
      updateClient: (id, data) => {
        set((state) => ({
          clients: state.clients.map((c) => (c.id === id ? { ...c, ...data } : c)),
        }));
      },
      
      deleteClient: (id) => {
        set((state) => ({
          clients: state.clients.filter((c) => c.id !== id),
        }));
      },
      
      // Appointments
      addAppointment: (appointmentData) => {
        const newAppointment: Appointment = {
          ...appointmentData,
          id: generateId(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          confirmationCode: generateConfirmationCode(),
        };
        set((state) => ({ appointments: [...state.appointments, newAppointment] }));
        
        // Update client stats
        const client = get().clients.find(c => c.id === appointmentData.clientId);
        if (client) {
          get().updateClient(client.id, {
            totalVisits: client.totalVisits + 1,
            totalSpent: client.totalSpent + appointmentData.totalPrice,
            lastVisit: new Date().toISOString(),
          });
        }
        
        return newAppointment;
      },
      
      updateAppointment: (id, data) => {
        set((state) => ({
          appointments: state.appointments.map((a) => 
            a.id === id ? { ...a, ...data, updatedAt: new Date().toISOString() } : a
          ),
        }));
      },
      
      updateAppointmentStatus: (id, status) => {
        set((state) => ({
          appointments: state.appointments.map((a) => 
            a.id === id ? { ...a, status, updatedAt: new Date().toISOString() } : a
          ),
        }));
      },
      
      deleteAppointment: (id) => {
        set((state) => ({
          appointments: state.appointments.filter((a) => a.id !== id),
        }));
      },
      
      getAppointmentsByDate: (date) => {
        return get().appointments.filter((a) => a.date === date);
      },
      
      getAppointmentsByProfessional: (professionalId, date) => {
        return get().appointments.filter((a) => a.professionalId === professionalId && a.date === date);
      },
      
      getAvailableSlots: async (date: string, _professionalId?: string, duration?: number, serviceId?: string) => {
        try {
          // backend route: /api/slots/:date/:serviceId?duration=
          // if serviceId provided, use it + duration from it; else fallback to 30min default
          const svc = serviceId || 'nago-fem';
          const svcData = MOCK_SERVICES.find(s => s.id === svc);
          const effectiveDuration = duration || (svcData ? svcData.duration : 30);
          const params = effectiveDuration ? `?duration=${effectiveDuration}` : '';
          const slots = await fetchApi<string[]>(`/api/slots/${date}/${svc}${params}`);
          return slots;
        } catch (e) {
          console.error('Erro ao buscar slots do backend:', e);
          // Se falhar, retorna lista vazia em vez de mostrar horários locais não confiáveis
          return [];
        }
      },
      
      // UI Actions
      toggleDarkMode: () => {
        set((state) => ({ isDarkMode: !state.isDarkMode }));
      },
      
      setSidebarOpen: (open) => {
        set({ sidebarOpen: open });
      },
      
      // Computed
      getDashboardMetrics: () => {
        const { appointments, clients } = get();
        const todayAppointments = appointments.filter(a => a.date === today);
        const monthAppointments = appointments.filter(a => a.date.startsWith(thisMonth));
        const completedToday = todayAppointments.filter(a => a.status === 'completed');
        const completedMonth = monthAppointments.filter(a => a.status === 'completed');
        
        const newClientsThisMonth = clients.filter(c => c.createdAt.startsWith(thisMonth)).length;
        
        // Calculate occupancy rate (simplified)
        const totalSlotsPerDay = 32; // 8 hours * 4 slots per hour (30 min)
        const workingDays = 26;
        const totalMonthlySlots = totalSlotsPerDay * workingDays * get().professionals.length;
        const bookedSlots = monthAppointments.length;
        const occupancyRate = totalMonthlySlots > 0 ? Math.round((bookedSlots / totalMonthlySlots) * 100) : 0;
        
        return {
          todayRevenue: completedToday.reduce((sum, a) => sum + a.totalPrice, 0),
          monthRevenue: completedMonth.reduce((sum, a) => sum + a.totalPrice, 0),
          todayAppointments: todayAppointments.length,
          monthAppointments: monthAppointments.length,
          newClientsThisMonth,
          totalClients: clients.length,
          occupancyRate,
        };
      },
    }),
    {
      name: 'salon-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        services: state.services,
        professionals: state.professionals,
        clients: state.clients,
        appointments: state.appointments,
        isDarkMode: state.isDarkMode,
      }),
    }
  )
);