import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function formatDate(dateString: string, options?: Intl.DateTimeFormatOptions): string {
  if (!dateString) return '';
  const parts = dateString.split('-');
  if (parts.length === 3) {
    const [year, month, day] = parts;
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    if (!options || Object.keys(options).length === 0 || options.day === '2-digit') {
      return `${day}/${month}/${year}`;
    }
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      ...options,
    });
  }
  const date = new Date(dateString + 'T00:00:00');
  return date.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    ...options,
  });
}

export function formatShortDate(dateString: string): string {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
}

export function formatTime(timeString: string): string {
  return timeString.substring(0, 5);
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const h = hours === 1 ? '1 hora' : `${hours} horas`;
  return mins === 0 ? h : `${h} ${mins} min`;
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
}

export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    corte: 'champagne',
    coloracao: 'roseGold',
    tratamentos: 'emerald',
    escova: 'amber',
    manicure: 'pink',
    pedicure: 'purple',
    sobrancelha: 'orange',
    maquiagem: 'rose',
    spa: 'teal',
  };
  return colors[category] || 'zinc';
}

export function generateWhatsAppLink(phone: string, message: string): string {
  const cleanPhone = phone.replace(/\D/g, '');
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/55${cleanPhone}?text=${encodedMessage}`;
}

export function getAppointmentMessage(appointment: {
  confirmationCode: string;
  clientName: string;
  date: string;
  time: string;
  serviceNames: string[];
  professionalName?: string;
  totalPrice: number;
}): string {
  const date = formatDate(appointment.date);
  const services = appointment.serviceNames.join(', ');
  const professional = appointment.professionalName ? ` com ${appointment.professionalName}` : '';
  
  return `Olá ${appointment.clientName}! ✨

Seu agendamento foi confirmado! 📅

📋 *Código:* ${appointment.confirmationCode}
📅 *Data:* ${date}
⏰ *Horário:* ${appointment.time}
💇 *Serviços:* ${services}${professional}
💰 *Total:* ${formatCurrency(appointment.totalPrice)}

Nos vemos em breve! 

Salão Nateliê Hair ✨`;
}

export function getReminderMessage(appointment: {
  clientName: string;
  date: string;
  time: string;
  confirmationCode: string;
}): string {
  const date = formatDate(appointment.date);
  
  return `Olá ${appointment.clientName}! ✨

Lembrete do seu agendamento amanhã! 📅

📋 *Código:* ${appointment.confirmationCode}
📅 *Data:* ${date}
⏰ *Horário:* ${appointment.time}

Te esperamos! 

Salão Nateliê Hair ✨`;
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function validateCPF(cpf: string): boolean {
  const clean = cpf.replace(/\D/g, '');
  if (clean.length !== 11 || /^(\d)\1+$/.test(clean)) return false;
  
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(clean[i]) * (10 - i);
  let digit = (sum * 10) % 11;
  if (digit === 10) digit = 0;
  if (digit !== parseInt(clean[9])) return false;
  
  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(clean[i]) * (11 - i);
  digit = (sum * 10) % 11;
  if (digit === 10) digit = 0;
  if (digit !== parseInt(clean[10])) return false;
  
  return true;
}

export function validatePhone(phone: string): boolean {
  const clean = phone.replace(/\D/g, '');
  return clean.length >= 10 && clean.length <= 11;
}

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}