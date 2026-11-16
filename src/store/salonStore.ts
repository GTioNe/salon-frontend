import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Service, Professional, Client, Appointment, AppointmentStatus } from '../types';
import { MOCK_SERVICES, MOCK_PROFESSIONALS, MOCK_CLIENTS, MOCK_APPOINTMENTS } from '../data/mockData';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';

async function fetchApi<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
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
  getAvailableSlots: (date: string, professionalId?: string, duration?: number) => Promise<string[]>;
  
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
      
      getAvailableSlots: async (date: string, professionalId?: string, duration?: number) => {
        try {
          // backend route is /api/slots/:date/:serviceId
          // for now, use first selected service if none provided
          const serviceId = 'nago-fem'; // fallback
          const slots = await fetchApi<string[]>(`/api/slots/${date}/${serviceId}`);
          return slots;
        } catch (e) {
          console.log('Backend slots offline, using local:', e);
          // fallback to local logic
          const appointments = professionalId 
            ? get().getAppointmentsByProfessional(professionalId, date)
            : get().getAppointmentsByDate(date);
          
          const professional = professionalId 
            ? get().professionals.find(p => p.id === professionalId)
            : get().professionals[0];
          
          if (!professional) return [];
          
          const dayOfWeek = new Date(date).getDay().toString();
          const schedule = professional.schedule[dayOfWeek];
          if (!schedule) return [];
          
          const slots: string[] = [];
          const [startHour, startMin] = schedule.start.split(':').map(Number);
          const [endHour, endMin] = schedule.end.split(':').map(Number);
          
          let currentMinutes = startHour * 60 + startMin;
          const endMinutes = endHour * 60 + endMin;
          
          while (currentMinutes + (duration || 30) <= endMinutes) {
            const hour = Math.floor(currentMinutes / 60).toString().padStart(2, '0');
            const min = (currentMinutes % 60).toString().padStart(2, '0');
            const time = `${hour}:${min}`;
            
            const isBooked = appointments.some(a => a.time === time && a.status !== 'cancelled');
            
            if (!isBooked) {
              slots.push(time);
            }
            
            currentMinutes += 30;
          }
          
          return slots;
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