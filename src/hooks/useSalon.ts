import { useState, useEffect, useCallback } from 'react';
import { useSalonStore } from '../store/salonStore';
import type { Appointment, Service, Professional, Client } from '../types';

export function useAppointments(date?: string) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const getAppointmentsByDate = useSalonStore((state) => state.getAppointmentsByDate);
  const storeAppointments = useSalonStore((state) => state.appointments);

  useEffect(() => {
    const targetDate = date || new Date().toISOString().split('T')[0];
    setAppointments(getAppointmentsByDate(targetDate));
    setLoading(false);
  }, [date, getAppointmentsByDate]);

  useEffect(() => {
    const targetDate = date || new Date().toISOString().split('T')[0];
    setAppointments(getAppointmentsByDate(targetDate));
  }, [storeAppointments, date]);

  const updateStatus = useCallback((id: string, status: Appointment['status']) => {
    useSalonStore.getState().updateAppointmentStatus(id, status);
  }, []);

  const deleteAppointment = useCallback((id: string) => {
    useSalonStore.getState().deleteAppointment(id);
  }, []);

  return { appointments, loading, updateStatus, deleteAppointment, refresh: () => setAppointments(getAppointmentsByDate(date || new Date().toISOString().split('T')[0])) };
}

export function useServices(category?: string) {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const storeServices = useSalonStore((state) => state.services);

  useEffect(() => {
    let filtered = storeServices;
    if (category) {
      filtered = storeServices.filter((s) => s.category === category);
    }
    setServices(filtered);
    setLoading(false);
  }, [storeServices, category]);

  return { services, loading };
}

export function useProfessionals(specialty?: string) {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);
  const storeProfessionals = useSalonStore((state) => state.professionals);

  useEffect(() => {
    let filtered = storeProfessionals;
    if (specialty) {
      filtered = storeProfessionals.filter((p) => p.specialties.includes(specialty as any));
    }
    setProfessionals(filtered);
    setLoading(false);
  }, [storeProfessionals, specialty]);

  return { professionals, loading };
}

export function useClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const storeClients = useSalonStore((state) => state.clients);

  useEffect(() => {
    setClients(storeClients);
    setLoading(false);
  }, [storeClients]);

  const searchClients = useCallback((query: string) => {
    if (!query) return storeClients;
    const lower = query.toLowerCase();
    return storeClients.filter(
      (c) =>
        c.name.toLowerCase().includes(lower) ||
        c.phone.includes(query) ||
        c.email.toLowerCase().includes(lower)
    );
  }, [storeClients]);

  return { clients, loading, searchClients };
}

export function useAvailableSlots(date: string, professionalId?: string, duration = 30) {
  const [slots, setSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const getAvailableSlots = useSalonStore((state) => state.getAvailableSlots);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getAvailableSlots(date, professionalId, duration)
      .then((available) => {
        if (!cancelled) setSlots(available);
      })
      .catch((err) => {
        console.error(err);
        if (!cancelled) setSlots([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [date, professionalId, duration, getAvailableSlots]);

  return { slots, loading };
}

type DashboardMetrics = {
  todayRevenue: number;
  monthRevenue: number;
  todayAppointments: number;
  monthAppointments: number;
  newClientsThisMonth: number;
  totalClients: number;
  occupancyRate: number;
};

export function useDashboardMetrics() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const getDashboardMetrics = useSalonStore((state) => state.getDashboardMetrics);
  const appointments = useSalonStore((state) => state.appointments);
  const clients = useSalonStore((state) => state.clients);

  useEffect(() => {
    setMetrics(getDashboardMetrics());
  }, [getDashboardMetrics, appointments, clients]);

  return { metrics, loading: !metrics };
}

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue] as const;
}

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) setMatches(media.matches);
    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [matches, query]);

  return matches;
}

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}