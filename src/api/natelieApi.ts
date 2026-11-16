const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export async function fetchServices() {
  const res = await fetch(`${API_BASE}/services`, {
    headers: { 'ngrok-skip-browser-warning': '' }
  });
  if (!res.ok) throw new Error('Erro ao buscar serviços');
  return res.json();
}

export async function fetchSlots(date: string, serviceId: string) {
  const res = await fetch(`${API_BASE}/slots?date=${date}&serviceId=${serviceId}`, {
    headers: { 'ngrok-skip-browser-warning': '' }
  });
  if (!res.ok) throw new Error('Erro ao buscar horários');
  return res.json();
}

export async function reserveAppointment(data: {
  serviceId: string;
  date: string;
  time: string;
  client: {
    nome: string;
    zap: string;
    email?: string;
    onde: 'espaco' | 'casa';
    endereco?: string;
    pagamento?: string;
    obs?: string;
    extra?: Record<string, any>;
  };
}) {
  const res = await fetch(`${API_BASE}/reserve`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': '' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || 'Erro ao reservar');
  }
  return res.json();
}

export async function confirmAppointment(reservationId: string, confirmationCode: string) {
  const res = await fetch(`${API_BASE}/confirm`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': '' },
    body: JSON.stringify({ reservationId, confirmationCode }),
  });
  if (!res.ok) throw new Error('Erro ao confirmar agendamento');
  return res.json();
}

export async function cancelAppointment(reservationId: string) {
  const res = await fetch(`${API_BASE}/cancel`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': '' },
    body: JSON.stringify({ reservationId }),
  });
  if (!res.ok) throw new Error('Erro ao cancelar agendamento');
  return res.json();
}
