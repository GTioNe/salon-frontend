import { motion } from 'framer-motion';
import { Calendar, Users, DollarSign, TrendingUp, CheckCircle, XCircle, AlertCircle, Scissors } from 'lucide-react';
import { Card, Badge, Button } from '../../components/ui';
import { formatCurrency, formatDate, formatTime } from '../../lib/utils';
import { useSalonStore } from '../../store/salonStore';
import { STATUS_LABELS, type AppointmentStatus } from '../../types';

export function AdminDashboard() {
  const { getDashboardMetrics, getAppointmentsByDate, professionals } = useSalonStore();
  const metrics = getDashboardMetrics();
  const today = new Date().toISOString().split('T')[0];
  const todayAppointments = getAppointmentsByDate(today);
  const pendingAppointments = todayAppointments.filter((a) => a.status === 'pending');
  const confirmedAppointments = todayAppointments.filter((a) => a.status === 'confirmed');

  const metricCards = [
    { label: 'Faturamento Hoje', value: formatCurrency(metrics.todayRevenue), icon: DollarSign, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Faturamento Mês', value: formatCurrency(metrics.monthRevenue), icon: TrendingUp, color: 'text-champagne-400', bg: 'bg-champagne-500/10' },
    { label: 'Agendamentos Hoje', value: metrics.todayAppointments.toString(), icon: Calendar, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'Novos Clientes', value: metrics.newClientsThisMonth.toString(), icon: Users, color: 'text-roseGold-400', bg: 'bg-roseGold-500/10' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="font-display font-bold text-3xl gradient-text">Dashboard</h1>
          <p className="text-zinc-400 mt-1">Visão geral do salão - {formatDate(today)}</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary">Exportar Relatório</Button>
          <Button>Novo Agendamento</Button>
        </div>
      </motion.div>

      {/* Metrics Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {metricCards.map((metric, i) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="glass-card p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-zinc-400 text-sm mb-1">{metric.label}</p>
                <p className="font-display font-bold text-2xl lg:text-3xl">{metric.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-xl ${metric.bg} flex items-center justify-center`}>
                <metric.icon className={`w-6 h-6 ${metric.color}`} />
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Today's Agenda + Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid lg:grid-cols-3 gap-6"
      >
        {/* Today's Appointments */}
        <motion.div className="lg:col-span-2">
          <Card className="glass-card p-0 overflow-hidden">
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <h2 className="font-display font-semibold text-xl gradient-text">
                Agenda de Hoje
              </h2>
              <Badge variant="premium" className="text-sm">
                {todayAppointments.length} agendamentos
              </Badge>
            </div>

            <div className="divide-y divide-white/5">
              {todayAppointments.length === 0 ? (
                <div className="p-12 text-center">
                  <Calendar className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
                  <p className="text-zinc-400">Nenhum agendamento para hoje</p>
                </div>
              ) : (
                todayAppointments.map((apt, i) => (
                  <motion.div
                    key={apt.id}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="p-4 hover:bg-white/5 transition-colors flex items-center gap-4"
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${getStatusBg(apt.status)}`}>
                      {(function () {
                        const Icon = getStatusIcon(apt.status);
                        return <Icon className={`w-6 h-6 ${getStatusTextColor(apt.status)}`} />;
                      })()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <p className="font-medium text-zinc-100 truncate">{apt.clientName}</p>
                        <Badge className={`capitalize ${getStatusBadgeClass(apt.status)}`}>
                          {STATUS_LABELS[apt.status]}
                        </Badge>
                      </div>
                      <p className="text-zinc-400 text-sm">
                        {apt.serviceNames.join(', ')} • {apt.professionalName || 'Profissional flexível'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-champagne-300">{formatTime(apt.time)}</p>
                      <p className="text-zinc-500 text-sm">{formatCurrency(apt.totalPrice)}</p>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </Card>
        </motion.div>

        {/* Quick Stats Sidebar */}
        <motion.div>
          <Card className="glass-card p-6">
            <h3 className="font-display font-semibold text-lg gradient-text mb-4">Resumo Rápido</h3>
            <div className="space-y-4">
              <QuickStat label="Pendentes" value={pendingAppointments.length} icon={AlertCircle} color="text-amber-400" />
              <QuickStat label="Confirmados" value={confirmedAppointments.length} icon={CheckCircle} color="text-emerald-400" />
              <QuickStat label="Profissionais" value={professionals.length} icon={Users} color="text-champagne-400" />
              <QuickStat label="Ocupação Mês" value={`${metrics.occupancyRate}%`} icon={TrendingUp} color="text-blue-400" />
            </div>
          </Card>

          <Card className="glass-card p-6 mt-6">
            <h3 className="font-display font-semibold text-lg gradient-text mb-4">Ações Rápidas</h3>
            <div className="space-y-3">
              <Button className="w-full justify-start gap-3" variant="secondary">
                <Scissors className="w-5 h-5" />
                Adicionar Serviço
              </Button>
              <Button className="w-full justify-start gap-3" variant="secondary">
                <Users className="w-5 h-5" />
                Cadastrar Cliente
              </Button>
              <Button className="w-full justify-start gap-3" variant="secondary">
                <Calendar className="w-5 h-5" />
                Nova Agenda
              </Button>
              <Button className="w-full justify-start gap-3" variant="secondary">
                <DollarSign className="w-5 h-5" />
                Ver Financeiro
              </Button>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}

interface QuickStatProps {
  label: string;
  value: number | string;
  icon: typeof AlertCircle;
  color: string;
}

function QuickStat({ label, value, icon: Icon, color }: QuickStatProps) {
  return (
    <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl">
      <div className={`w-10 h-10 rounded-lg ${color}/10 flex items-center justify-center`}>
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
      <div className="flex-1">
        <p className="text-zinc-400 text-sm">{label}</p>
        <p className="font-display font-bold text-xl">{value}</p>
      </div>
    </div>
  );
}

function getStatusBg(status: AppointmentStatus): string {
  const colors: Record<AppointmentStatus, string> = {
    pending: 'bg-amber-500/20',
    confirmed: 'bg-emerald-500/20',
    completed: 'bg-blue-500/20',
    cancelled: 'bg-rose-500/20',
  };
  return colors[status] || 'bg-zinc-500/20';
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

function getStatusBadgeClass(status: AppointmentStatus): string {
  const classes: Record<AppointmentStatus, string> = {
    pending: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    confirmed: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    completed: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    cancelled: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
  };
  return classes[status] || 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30';
}