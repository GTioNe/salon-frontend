import type { Service, Professional, Client, Appointment, ServiceCategory } from '../types';

export const MOCK_SERVICES: Service[] = [
  // Tranças
  { id: 'nago-solta', name: 'Nagô Solta', description: 'Tranças soltas tradicionais, trabalho completo e detalhado', price: 330, duration: 600, category: 'trancas', popular: true },
  { id: 'chanel', name: 'Chanel', description: 'Corte Chanel com tranças', price: 250, duration: 300, category: 'trancas', popular: true },
  { id: 'nago-masc', name: 'Masculino', description: 'Tranças nagô estilo masculino', price: 90, duration: 180, category: 'trancas' },
  { id: 'nago-fem', name: 'Nagô Feminino', description: 'Tranças nagô estilo feminino', price: 180, duration: 180, category: 'trancas', popular: true },
  { id: 'nago-rabo', name: 'Nagô Rabo/Coque', description: 'Nagô com finalização em rabo de cavalo ou coque', price: 200, duration: 180, category: 'trancas' },
  { id: 'nago-tiara', name: 'Nagô Tiara', description: 'Nagô com tiara frontal', price: 65, duration: 240, category: 'trancas' },
  { id: 'nago-lateral', name: 'Nagô Lateral/Topo', description: 'Nagô lateral ou no topo da cabeça', price: 35, duration: 60, category: 'trancas' },
  { id: 'nago-lace', name: 'Nagô Lace Básico', description: 'Nagô com finalização lace frontal básica', price: 90, duration: 150, category: 'trancas' },
  { id: 'nago-simples-rabo', name: 'Nagô Simples + Rabo', description: 'Nagô básico com rabo de cavalo', price: 100, duration: 180, category: 'trancas' },

  // Química & Alisamentos
  { id: 'escova-curta', name: 'Escova Curta', description: 'Escova progressiva para cabelos curtos', price: 35, duration: 45, category: 'quimica' },
  { id: 'escova-media', name: 'Escova Média', description: 'Escova progressiva para cabelos médios', price: 45, duration: 90, category: 'quimica' },
  { id: 'escova-longa', name: 'Escova', description: 'Escova modelada para cabelos longos e médios', price: 60, duration: 150, category: 'quimica' },
  { id: 'corte', name: 'Corte', description: 'Corte de cabelo', price: 40, duration: 45, category: 'quimica' },
  { id: 'corte-escova', name: 'Corte + Escova', description: 'Corte completo com escova', price: 60, duration: 135, category: 'quimica', popular: true },
  { id: 'botox-natelie', name: 'Botox Nateliê', description: 'Botox capilar com produto profissional da Nateliê', price: 130, duration: 180, category: 'quimica', popular: true },
  { id: 'progressiva-raiz', name: 'Progressiva Raiz', description: 'Retoque de progressiva na raiz', price: 170, duration: 90, category: 'quimica', popular: true },
  { id: 'progressiva-global-curto', name: 'Progressiva Global Curto', description: 'Progressiva completa para cabelos curtos', price: 170, duration: 120, category: 'quimica' },
  { id: 'progressiva-global-longo', name: 'Progressiva Global', description: 'Progressiva completa de alto padrão', price: 170, duration: 240, category: 'quimica', popular: true },
  { id: 'blindagem', name: 'Blindagem', description: 'Blindagem capilar para proteção e brilho', price: 60, duration: 90, category: 'quimica' },
];

export const MOCK_PROFESSIONALS: Professional[] = [
  {
    id: 'prof-1',
    name: 'Naty Nascimento',
    role: 'Hair Stylist & Braider Master',
    specialties: ['trancas', 'quimica'],
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=naty',
    rating: 5.0,
    reviewCount: 412,
    bio: 'Especialista em tranças nagô, box braids e alisamentos profissionais. Anos de experiência transformando visuais e valorizando a beleza.',
    schedule: {
      '1': { start: '09:00', end: '19:00' },
      '2': { start: '09:00', end: '17:00' },
      '3': { start: '09:00', end: '19:00' },
      '4': { start: '09:00', end: '17:00' },
      '5': { start: '09:00', end: '19:00' },
      '6': { start: '09:00', end: '19:00' },
      '0': { start: '09:00', end: '17:00' },
    },
  },
];

// Não mantenha dados reais de clientes no frontend público.
export const MOCK_CLIENTS: Client[] = [];

// Nenhum agendamento real de cliente no frontend público.
export const MOCK_APPOINTMENTS: Appointment[] = [];

export const getServicesByCategory = (category: ServiceCategory) => 
  MOCK_SERVICES.filter(s => s.category === category);

export const getServiceById = (id: string) => 
  MOCK_SERVICES.find(s => s.id === id);

export const getProfessionalById = (id: string) => 
  MOCK_PROFESSIONALS.find(p => p.id === id);

export const getClientById = (id: string) => 
  MOCK_CLIENTS.find(c => c.id === id);

export const getAppointmentsByDate = (date: string) => 
  MOCK_APPOINTMENTS.filter(a => a.date === date);

export const getAppointmentsByClient = (clientId: string) => 
  MOCK_APPOINTMENTS.filter(a => a.clientId === clientId);
