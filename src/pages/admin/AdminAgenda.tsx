import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, MessageCircle
} from 'lucide-react';
import { Button, Modal } from '../../components/ui';
import { useSalonStore } from '../../store/salonStore';
import { type Appointment, type AppointmentStatus } from '../../types';
import { addDays, startOfWeek, endOfWeek, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

function getStatusPill(status: AppointmentStatus) {
  if (status === 'pending') return { bg: 'bg-amber-500/15', border: 'border-amber-500/30', text: 'text-amber-400', label: 'Pendente' };
  if (status === 'confirmed') return { bg: 'bg-indigo-500/15', border: 'border-indigo-500/30', text: 'text-indigo-400', label: 'Confirmado' };
  if (status === 'completed') return { bg: 'bg-blue-500/15', border: 'border-blue-500/30', text: 'text-blue-400', label: 'Sinal Pago' };
  return { bg: 'bg-rose-500/15', border: 'border-rose-500/30', text: 'text-rose-400', label: 'Cancelado' };
}

function formatTimeRange(start: string, durationMin: number) {
  const [h, m] = start.split(':').map(Number);
  const totalMin = (h || 0) * 60 + (m || 0) + (durationMin || 60);
  const endH = Math.floor(totalMin / 60) % 24;
  const endM = totalMin % 60;
  return `${start} - ${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;
}

export function AdminAgenda() {
  const { getAppointmentsByDate, addAppointment, updateAppointmentStatus, professionals } = useSalonStore();
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [view, setView] = useState<'week' | 'day'>('week');
  const [selectedStylist, setSelectedStylist] = useState<string>('all');
  const [selectedApt, setSelectedApt] = useState<Appointment | null>(null);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [newAptOpen, setNewAptOpen] = useState(false);
  const [defaultTimeForNew, setDefaultTimeForNew] = useState('09:00');

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const getFilteredAppointments = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    let apts = getAppointmentsByDate(dateStr);
    if (selectedStylist !== 'all') {
      apts = apts.filter((a) => a.professionalId === selectedStylist);
    }
    return apts;
  };

  const navigateWeek = (direction: number) => {
    setCurrentDate((d) => addDays(d, direction * 7));
  };

  const handleStatusChange = (aptId: string, status: AppointmentStatus) => {
    updateAppointmentStatus(aptId, status);
    setStatusModalOpen(false);
    setSelectedApt(null);
  };

  const openWhatsApp = (phone: string, clientName: string, serviceName: string, time: string) => {
    const clean = phone ? phone.replace(/\D/g, '') : '';
    const num = clean.startsWith('55') ? clean : clean ? `55${clean}` : '5511952239221';
    const msg = encodeURIComponent(`Olá ${clientName}! Lembrando do seu agendamento de ${serviceName} no Nateliê Hair às ${time}.`);
    window.open(`https://wa.me/${num}?text=${msg}`, '_blank');
  };

  const handleOpenNewSlot = (time?: string) => {
    if (time) setDefaultTimeForNew(time);
    setNewAptOpen(true);
  };

  return (
    <div className="font-stripe space-y-6 max-w-[1400px] mx-auto p-4 lg:p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-light tracking-tight text-white">Agenda</h1>
          <p className="text-[#8a8f98] mt-1 text-sm">Calendário detalhado de atendimentos</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-[#1c1e54] border border-white/[0.06] rounded-xl px-3 py-1.5">
            <Button variant="ghost" size="sm" onClick={() => navigateWeek(-1)}>
              <ChevronLeft className="w-4 h-4 text-[#8a8f98]" />
            </Button>
            <span className="text-sm font-light text-white min-w-[180px] text-center">
              {view === 'week'
                ? `${format(weekStart, 'dd/MM')} - ${format(weekEnd, 'dd/MM/yyyy')}`
                : format(currentDate, 'EEEE, dd/MM/yyyy', { locale: ptBR })}
            </span>
            <Button variant="ghost" size="sm" onClick={() => navigateWeek(1)}>
              <ChevronRight className="w-4 h-4 text-[#8a8f98]" />
            </Button>
          </div>

          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-[#1c1e54] border border-white/[0.06] text-white hover:bg-white/[0.04] transition-colors"
          >
            Hoje
          </button>

          <button
            onClick={() => handleOpenNewSlot()}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-lilac-500 text-[#12122b] hover:bg-lilac-400 transition-colors shadow-lg shadow-lilac-500/20"
          >
            <Plus className="w-4 h-4" />
            Novo Agendamento
          </button>
        </div>
      </motion.div>

      {/* Top Filters Bar */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-[#1c1e54] border border-white/[0.06] rounded-2xl p-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          {/* Estilista Select */}
          <div>
            <label className="block text-xs text-[#8a8f98] mb-1 font-medium uppercase tracking-wider">
              Filtrar por Estilista
            </label>
            <select
              value={selectedStylist}
              onChange={(e) => setSelectedStylist(e.target.value)}
              className="w-full bg-[#12122b] border border-white/[0.06] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-lilac-500 transition-colors"
            >
              <option value="all">Todas as Estilistas</option>
              {professionals.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Date Selector */}
          <div>
            <label className="block text-xs text-[#8a8f98] mb-1 font-medium uppercase tracking-wider">
              Seletor de Data
            </label>
            <input
              type="date"
              value={currentDate.toISOString().split('T')[0]}
              onChange={(e) => {
                if (e.target.value) setCurrentDate(new Date(e.target.value + 'T12:00:00'));
              }}
              className="w-full bg-[#12122b] border border-white/[0.06] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-lilac-500 transition-colors"
            />
          </div>

          {/* View Toggle (Semana / Dia) */}
          <div>
            <label className="block text-xs text-[#8a8f98] mb-1 font-medium uppercase tracking-wider">
              Visualização
            </label>
            <div className="flex bg-[#12122b] border border-white/[0.06] p-1 rounded-xl gap-1">
              <button
                onClick={() => setView('day')}
                className={`flex-1 py-1.5 text-xs font-medium rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
                  view === 'day'
                    ? 'bg-lilac-500 text-[#12122b] font-semibold shadow-sm'
                    : 'text-[#8a8f98] hover:text-white'
                }`}
              >
                <CalendarIcon className="w-3.5 h-3.5" />
                Dia
              </button>
              <button
                onClick={() => setView('week')}
                className={`flex-1 py-1.5 text-xs font-medium rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
                  view === 'week'
                    ? 'bg-lilac-500 text-[#12122b] font-semibold shadow-sm'
                    : 'text-[#8a8f98] hover:text-white'
                }`}
              >
                <CalendarIcon className="w-3.5 h-3.5" />
                Semana
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Grid View */}
      {view === 'week' ? (
        <WeekGridView
          weekDays={weekDays}
          getAppointments={getFilteredAppointments}
          onSelectApt={(apt) => {
            setSelectedApt(apt);
            setStatusModalOpen(true);
          }}
          onOpenNewSlot={handleOpenNewSlot}
          onWhatsApp={openWhatsApp}
        />
      ) : (
        <DayGridView
          date={currentDate}
          appointments={getFilteredAppointments(currentDate)}
          onSelectApt={(apt) => {
            setSelectedApt(apt);
            setStatusModalOpen(true);
          }}
          onOpenNewSlot={handleOpenNewSlot}
          onWhatsApp={openWhatsApp}
        />
      )}

      {/* Status Modal */}
      <Modal
        isOpen={statusModalOpen && !!selectedApt}
        onClose={() => {
          setStatusModalOpen(false);
          setSelectedApt(null);
        }}
        title="Detalhes & Status do Agendamento"
        size="md"
      >
        {selectedApt && (
          <div className="space-y-4 text-sm">
            <div className="bg-[#12122b] border border-white/[0.06] rounded-xl p-4 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[#8a8f98]">Cliente:</span>
                <span className="text-white font-medium">{selectedApt.clientName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#8a8f98]">Serviço:</span>
                <span className="text-white">{selectedApt.serviceNames.join(', ')}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#8a8f98]">Horário:</span>
                <span className="text-white">{formatTimeRange(selectedApt.time, selectedApt.duration || 60)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#8a8f98]">Profissional:</span>
                <span className="text-[#8a8f98]">{selectedApt.professionalName || 'Naty'}</span>
              </div>
            </div>

            <p className="text-xs text-[#8a8f98] font-medium uppercase tracking-wider">Alterar Status:</p>
            <div className="grid grid-cols-2 gap-2">
              {(['pending', 'confirmed', 'completed', 'cancelled'] as const).map((st) => {
                const pill = getStatusPill(st);
                return (
                  <button
                    key={st}
                    onClick={() => handleStatusChange(selectedApt.id, st)}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold text-center transition-all ${pill.bg} ${pill.border} ${pill.text} hover:opacity-90`}
                  >
                    {pill.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </Modal>

      {/* Modal Novo Agendamento */}
      <Modal
        isOpen={newAptOpen}
        onClose={() => setNewAptOpen(false)}
        title="Novo Agendamento"
        size="md"
      >
        <NewAppointmentForm
          defaultTime={defaultTimeForNew}
          onSave={(newAptData) => {
            addAppointment(newAptData);
            setNewAptOpen(false);
          }}
          onCancel={() => setNewAptOpen(false)}
        />
      </Modal>
    </div>
  );
}

// ========== WeekGridView ==========

function WeekGridView({
  weekDays,
  getAppointments,
  onSelectApt,
  onOpenNewSlot,
  onWhatsApp,
}: {
  weekDays: Date[];
  getAppointments: (date: Date) => Appointment[];
  onSelectApt: (apt: Appointment) => void;
  onOpenNewSlot: (time?: string) => void;
  onWhatsApp: (phone: string, clientName: string, serviceName: string, time: string) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-[#1c1e54] border border-white/[0.06] rounded-2xl overflow-x-auto p-4"
    >
      <div className="grid grid-cols-7 gap-3 min-w-[900px]">
        {weekDays.map((day) => {
          const dateStr = day.toISOString().split('T')[0];
          const isToday = dateStr === new Date().toISOString().split('T')[0];
          const dayApts = getAppointments(day);

          return (
            <div
              key={dateStr}
              className={`bg-[#12122b]/80 border rounded-xl p-3 flex flex-col min-h-[640px] ${
                isToday ? 'border-lilac-500/50 ring-1 ring-lilac-500/30' : 'border-white/[0.06]'
              }`}
            >
              {/* Day Header */}
              <div className="text-center pb-3 border-b border-white/[0.04] mb-3">
                <p className="text-[11px] text-[#8a8f98] uppercase tracking-wider">
                  {format(day, 'EEE', { locale: ptBR })}
                </p>
                <p className={`text-lg font-light ${isToday ? 'text-lilac-500 font-normal' : 'text-white'}`}>
                  {format(day, 'dd')}
                </p>
                <p className="text-[10px] text-[#8a8f98]">{format(day, 'MMM')}</p>
              </div>

              {/* Cards & Slots */}
              <div className="flex-1 space-y-2 relative">
                {dayApts.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-4">
                    <p className="text-xs text-[#8a8f98] mb-2">Sem agendamentos</p>
                    <button
                      onClick={() => onOpenNewSlot('09:00')}
                      className="text-[11px] text-lilac-500 hover:text-lilac-400 font-medium border border-lilac-500/20 px-2 py-1 rounded-lg"
                    >
                      Horário Disponível +
                    </button>
                  </div>
                ) : (
                  dayApts.map((apt) => {
                    const pill = getStatusPill(apt.status);
                    const durationInHours = Math.max(1, Math.round((apt.duration || 60) / 60));
                    const heightStyle = `${durationInHours * 110}px`;

                    return (
                      <div
                        key={apt.id}
                        onClick={() => onSelectApt(apt)}
                        style={{ minHeight: heightStyle }}
                        className={`group relative rounded-xl p-3 border transition-all cursor-pointer hover:border-lilac-500/40 flex flex-col justify-between ${pill.bg} ${pill.border}`}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-1 mb-1">
                            <span className="text-xs font-medium text-white truncate max-w-[110px]">
                              {apt.clientName}
                            </span>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold border ${pill.border} ${pill.text}`}>
                              {pill.label}
                            </span>
                          </div>

                          <p className="text-[11px] text-[#8a8f98] truncate">{apt.serviceNames.join(', ')}</p>
                          <p className="text-[10px] text-white/70 mt-1 tabular-nums">
                            {formatTimeRange(apt.time, apt.duration || 60)}
                          </p>
                        </div>

                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/[0.04]">
                          <span className="text-[10px] text-[#8a8f98]">
                            {apt.professionalName || 'Naty'}
                          </span>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onWhatsApp(
                                apt.clientPhone || '',
                                apt.clientName,
                                apt.serviceNames[0] || 'Serviço',
                                apt.time
                              );
                            }}
                            className="p-1 rounded-full bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors"
                            title="Enviar WhatsApp"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

// ========== DayGridView ==========

function DayGridView({
  date,
  appointments,
  onSelectApt,
  onOpenNewSlot,
  onWhatsApp,
}: {
  date: Date;
  appointments: Appointment[];
  onSelectApt: (apt: Appointment) => void;
  onOpenNewSlot: (time?: string) => void;
  onWhatsApp: (phone: string, clientName: string, serviceName: string, time: string) => void;
}) {
  const hours = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-[#1c1e54] border border-white/[0.06] rounded-2xl p-6"
    >
      <div className="mb-4">
        <h2 className="text-base font-light text-white">
          Agenda do Dia: {format(date, 'EEEE, dd de MMMM', { locale: ptBR })}
        </h2>
      </div>

      <div className="space-y-3">
        {hours.map((hour) => {
          const aptsInHour = appointments.filter((a) => a.time.startsWith(hour.substring(0, 2)));

          return (
            <div key={hour} className="flex gap-4 items-start border-b border-white/[0.04] pb-3">
              <span className="text-xs text-[#8a8f98] tabular-nums w-12 pt-1">{hour}</span>

              <div className="flex-1 flex flex-wrap gap-3">
                {aptsInHour.length === 0 ? (
                  <button
                    onClick={() => onOpenNewSlot(hour)}
                    className="text-xs text-[#8a8f98] hover:text-lilac-500 py-1.5 px-3 rounded-lg border border-dashed border-white/[0.06] hover:border-lilac-500/30 transition-all"
                  >
                    Horário Disponível +
                  </button>
                ) : (
                  aptsInHour.map((apt) => {
                    const pill = getStatusPill(apt.status);
                    return (
                      <div
                        key={apt.id}
                        onClick={() => onSelectApt(apt)}
                        className={`rounded-xl p-3 border transition-all cursor-pointer hover:border-lilac-500/40 flex items-center gap-4 min-w-[280px] ${pill.bg} ${pill.border}`}
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-sm font-medium text-white">{apt.clientName}</span>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${pill.border} ${pill.text}`}>
                              {pill.label}
                            </span>
                          </div>
                          <p className="text-xs text-[#8a8f98]">
                            {apt.serviceNames.join(', ')} • {formatTimeRange(apt.time, apt.duration || 60)}
                          </p>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onWhatsApp(apt.clientPhone || '', apt.clientName, apt.serviceNames[0] || '', apt.time);
                          }}
                          className="p-1.5 rounded-full bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

// ========== NewAppointmentForm ==========

function NewAppointmentForm({
  defaultTime,
  onSave,
  onCancel,
}: {
  defaultTime?: string;
  onSave: (aptData: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt' | 'confirmationCode'>) => void;
  onCancel: () => void;
}) {
  const { services, professionals } = useSalonStore();
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [selectedServiceId, setSelectedServiceId] = useState(services[0]?.id || '');
  const [selectedProfId, setSelectedProfId] = useState(professionals[0]?.id || '');
  const [time, setTime] = useState(defaultTime || '09:00');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim()) return;

    const svc = services.find((s) => s.id === selectedServiceId);
    const prof = professionals.find((p) => p.id === selectedProfId);

    onSave({
      clientId: `cli-${Date.now()}`,
      clientName,
      clientPhone: clientPhone || '5511952239221',
      clientEmail: '',
      serviceIds: svc ? [svc.id] : [],
      serviceNames: svc ? [svc.name] : ['Atendimento'],
      professionalId: prof?.id,
      professionalName: prof?.name || 'Naty',
      date,
      time,
      duration: svc?.duration || 60,
      totalPrice: svc?.price || 0,
      status: 'pending',
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-sm">
      <div>
        <label className="block text-xs text-[#8a8f98] mb-1 font-medium">Nome da Cliente</label>
        <input
          type="text"
          required
          placeholder="Ex: Ana Paula"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          className="w-full bg-[#12122b] border border-white/[0.06] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-lilac-500"
        />
      </div>

      <div>
        <label className="block text-xs text-[#8a8f98] mb-1 font-medium">WhatsApp / Telefone</label>
        <input
          type="text"
          placeholder="Ex: (11) 95223-9221"
          value={clientPhone}
          onChange={(e) => setClientPhone(e.target.value)}
          className="w-full bg-[#12122b] border border-white/[0.06] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-lilac-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-[#8a8f98] mb-1 font-medium">Serviço</label>
          <select
            value={selectedServiceId}
            onChange={(e) => setSelectedServiceId(e.target.value)}
            className="w-full bg-[#12122b] border border-white/[0.06] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-lilac-500"
          >
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} (R$ {s.price})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs text-[#8a8f98] mb-1 font-medium">Estilista</label>
          <select
            value={selectedProfId}
            onChange={(e) => setSelectedProfId(e.target.value)}
            className="w-full bg-[#12122b] border border-white/[0.06] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-lilac-500"
          >
            {professionals.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-[#8a8f98] mb-1 font-medium">Data</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full bg-[#12122b] border border-white/[0.06] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-lilac-500"
          />
        </div>

        <div>
          <label className="block text-xs text-[#8a8f98] mb-1 font-medium">Horário</label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full bg-[#12122b] border border-white/[0.06] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-lilac-500"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-white/[0.04]">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-xs font-medium rounded-xl border border-white/[0.06] text-[#8a8f98] hover:text-white transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-xs font-semibold rounded-xl bg-lilac-500 text-[#12122b] hover:bg-lilac-400 transition-colors shadow-lg shadow-lilac-500/20"
        >
          Salvar Agendamento
        </button>
      </div>
    </form>
  );
}