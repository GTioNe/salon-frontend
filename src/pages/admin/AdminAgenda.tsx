import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, ChevronLeft, ChevronRight, Plus, CheckCircle, XCircle, AlertCircle, Clock, User, Scissors } from 'lucide-react';
import { formatTime, formatCurrency } from '../../lib/utils';
import { Badge, Button, Modal } from '../../components/ui';
import { useSalonStore } from '../../store/salonStore';
import { STATUS_LABELS, type AppointmentStatus, type Appointment } from '../../types';
import { addDays, startOfWeek, endOfWeek, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface WeekViewProps {
  weekDays: Date[];
  dayAppointments: (date: Date) => Appointment[];
  onAppointmentClick: (apt: Appointment) => void;
}

interface DayViewProps {
  date: Date;
  appointments: Appointment[];
  onAppointmentClick: (apt: Appointment) => void;
}

export function AdminAgenda() {
  const { getAppointmentsByDate, updateAppointmentStatus } = useSalonStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'week' | 'day'>('week');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [statusModalOpen, setStatusModalOpen] = useState(false);

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const dayAppointments = (date: Date) => getAppointmentsByDate(date.toISOString().split('T')[0]);

  const navigateWeek = (direction: number) => {
    setCurrentDate((d) => addDays(d, direction * 7));
  };

  const navigateDay = (direction: number) => {
    setCurrentDate((d) => addDays(d, direction));
  };

  const handleStatusChange = (aptId: string, status: AppointmentStatus) => {
    updateAppointmentStatus(aptId, status);
    setStatusModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
      >
        <div>
          <h1 className="font-display font-bold text-3xl gradient-text">Agenda</h1>
          <p className="text-zinc-400 mt-1">Gerencie agendamentos da semana</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2">
            <Button variant="ghost" size="sm" onClick={() => (view === 'week' ? navigateWeek(-1) : navigateDay(-1))}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="font-medium text-zinc-100 min-w-[200px] text-center">
              {view === 'week'
                ? `${format(weekStart, 'dd/MM')} - ${format(weekEnd, 'dd/MM/yyyy')}`
                : format(currentDate, 'EEEE, dd MMMM yyyy', { locale: ptBR })}
            </span>
            <Button variant="ghost" size="sm" onClick={() => (view === 'week' ? navigateWeek(1) : navigateDay(1))}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          <Button variant="secondary" onClick={() => setCurrentDate(new Date())}>
            Hoje
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Novo Agendamento
          </Button>
        </div>
      </motion.div>

      {/* View Toggle */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-2 flex gap-2"
      >
        <Button
          variant={view === 'day' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => setView('day')}
          className="flex-1"
        >
          <Calendar className="w-4 h-4 mr-2" />
          Dia
        </Button>
        <Button
          variant={view === 'week' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => setView('week')}
          className="flex-1"
        >
          <Calendar className="w-4 h-4 mr-2" />
          Semana
        </Button>
      </motion.div>

      {view === 'week' ? (
        <WeekView
          weekDays={weekDays}
          dayAppointments={dayAppointments}
          onAppointmentClick={setSelectedAppointment}
        />
      ) : (
        <DayView
          date={currentDate}
          appointments={dayAppointments(currentDate)}
          onAppointmentClick={setSelectedAppointment}
        />
      )}

      {/* Status Change Modal */}
      <Modal
        isOpen={statusModalOpen && !!selectedAppointment}
        onClose={() => {
          setStatusModalOpen(false);
          setSelectedAppointment(null);
        }}
        title="Alterar Status"
        size="sm"
      >
        {selectedAppointment && (
          <div className="space-y-3">
            <p className="text-zinc-300">
              Alterar status de <strong>{selectedAppointment.clientName}</strong> - {selectedAppointment.serviceNames.join(', ')}
            </p>
            <div className="grid grid-cols-2 gap-2">
              {(['pending', 'confirmed', 'completed', 'cancelled'] as const).map((status) => (
                <Button
                  key={status}
                  variant={selectedAppointment.status === status ? 'primary' : 'secondary'}
                  className="w-full"
                  onClick={() => handleStatusChange(selectedAppointment.id, status)}
                >
                  {STATUS_LABELS[status]}
                </Button>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

function WeekView({ weekDays, dayAppointments, onAppointmentClick }: WeekViewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-x-auto"
    >
      <div className="grid grid-cols-7 gap-1 min-w-max">
        {weekDays.map((day, i) => {
          const dayStr = day.toISOString().split('T')[0];
          const isToday = dayStr === new Date().toISOString().split('T')[0];
          const appointments = dayAppointments(day);

          return (
            <motion.div
              key={dayStr}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`glass-card flex flex-col min-h-[500px] ${isToday ? 'ring-2 ring-champagne-500/50 bg-champagne-500/5' : ''}`}
            >
              <div className={`p-3 ${isToday ? 'bg-champagne-500/10' : ''}`}>
                <div className="text-center">
                  <p className="text-xs text-zinc-500 uppercase tracking-wide">{format(day, 'EEEE', { locale: ptBR })}</p>
                  <p className={`font-display font-bold text-2xl ${isToday ? 'text-champagne-300' : 'text-zinc-100'}`}>
                    {format(day, 'dd')}
                  </p>
                  <p className="text-xs text-zinc-500">{format(day, 'MMM')}</p>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {appointments.length === 0 ? (
                  <p className="text-zinc-500 text-sm text-center py-8">Livre</p>
                ) : (
                  appointments.map((apt) => (
                    <motion.button
                      key={apt.id}
                      onClick={() => onAppointmentClick(apt)}
                      className={`w-full p-3 rounded-xl text-left transition-all duration-200 ${getStatusBg(apt.status)} border ${getStatusBorder(apt.status)} hover:scale-[1.01] shadow-md`}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium text-zinc-100 truncate pr-2">{apt.clientName}</p>
                        <Badge size="sm" className={`capitalize ${getStatusBadgeClass(apt.status)}`}>
                          {STATUS_LABELS[apt.status]}
                        </Badge>
                      </div>
                      <p className="text-zinc-400 text-xs mb-1">{formatTime(apt.time)} • {apt.serviceNames[0]}</p>
                      <p className="text-champagne-400 text-xs font-medium">{formatCurrency(apt.totalPrice)}</p>
                    </motion.button>
                  ))
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

function DayView({ date, appointments, onAppointmentClick }: DayViewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card overflow-hidden"
    >
      {appointments.length === 0 ? (
        <div className="p-12 text-center">
          <Calendar className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
          <p className="text-zinc-400 text-lg">Nenhum agendamento para {format(date, 'EEEE, dd MMMM yyyy', { locale: ptBR })}</p>
        </div>
      ) : (
        <div className="divide-y divide-white/5">
          {appointments.map((apt, i) => (
            <motion.div
              key={apt.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="p-4 hover:bg-white/5 transition-colors"
              onClick={() => onAppointmentClick(apt)}
            >
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 ${getStatusBg(apt.status)}`}>
                  {(function () {
                    const Icon = getStatusIcon(apt.status);
                    return <Icon className={`w-7 h-7 ${getStatusTextColor(apt.status)}`} />;
                  })()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <p className="font-semibold text-zinc-100">{apt.clientName}</p>
                    <Badge className={`capitalize ${getStatusBadgeClass(apt.status)}`}>
                      {STATUS_LABELS[apt.status]}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-4 text-zinc-400 text-sm">
                    <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {formatTime(apt.time)}</span>
                    <span className="flex items-center gap-1"><Scissors className="w-4 h-4" /> {apt.serviceNames.join(', ')}</span>
                    <span className="flex items-center gap-1"><User className="w-4 h-4" /> {apt.professionalName || 'Flexível'}</span>
                    <span className="flex items-center gap-1 font-semibold text-champagne-300">{formatCurrency(apt.totalPrice)}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-display font-bold text-xl text-champagne-300">{formatTime(apt.time)}</p>
                  <p className="text-zinc-500 text-sm">{apt.confirmationCode}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

function getStatusBg(status: AppointmentStatus): string {
  const colors: Record<AppointmentStatus, string> = {
    pending: 'bg-amber-500/10',
    confirmed: 'bg-emerald-500/10',
    completed: 'bg-blue-500/10',
    cancelled: 'bg-rose-500/10',
  };
  return colors[status] || 'bg-zinc-500/10';
}

function getStatusBorder(status: AppointmentStatus): string {
  const colors: Record<AppointmentStatus, string> = {
    pending: 'border-amber-500/30',
    confirmed: 'border-emerald-500/30',
    completed: 'border-blue-500/30',
    cancelled: 'border-rose-500/30',
  };
  return colors[status] || 'border-zinc-500/30';
}

function getStatusBadgeClass(status: AppointmentStatus): string {
  const classes: Record<AppointmentStatus, string> = {
    pending: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    confirmed: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    completed: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    cancelled: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
  };
  return classes[status] || 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30';
}

function getStatusIcon(status: AppointmentStatus) {
  const icons: Record<AppointmentStatus, typeof AlertCircle> = {
    pending: AlertCircle,
    confirmed: CheckCircle,
    completed: CheckCircle,
    cancelled: XCircle,
  };
  return icons[status] || AlertCircle;
}

function getStatusTextColor(status: AppointmentStatus): string {
  const colors: Record<AppointmentStatus, string> = {
    pending: 'text-amber-400',
    confirmed: 'text-emerald-400',
    completed: 'text-blue-400',
    cancelled: 'text-rose-400',
  };
  return colors[status] || 'text-zinc-400';
}