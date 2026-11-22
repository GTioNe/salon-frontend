import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, Users, Calendar, Scissors } from 'lucide-react';
import { Button } from '../../components/ui';
import { useNavigate } from 'react-router-dom';
import { formatCurrency, formatTime } from '../../lib/utils';
import { useSalonStore } from '../../store/salonStore';
import { STATUS_LABELS } from '../../types';

export function AdminDashboard() {
  const navigate = useNavigate();
  const { getDashboardMetrics, getAppointmentsByDate } = useSalonStore();
  const metrics = getDashboardMetrics();
  const today = new Date().toISOString().split('T')[0];
  const todayAppointments = getAppointmentsByDate(today);

  const metricCards = [
    { id: 'faturamento-hoje', label: 'Faturamento Hoje', value: formatCurrency(metrics.todayRevenue), icon: DollarSign, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { id: 'faturamento-mes', label: 'Faturamento Mês', value: formatCurrency(metrics.monthRevenue), icon: TrendingUp, color: 'text-white', bg: 'bg-stripe-primary/15' },
    { id: 'agendamentos-hoje', label: 'Agendamentos Hoje', value: metrics.todayAppointments.toString(), icon: Calendar, color: 'text-[#a5a1ff]', bg: 'bg-stripe-primary/15' },
    { id: 'novos-clientes', label: 'Novos Clientes', value: metrics.newClientsThisMonth.toString(), icon: Users, color: 'text-stripe-ruby', bg: 'bg-[#ea2261]/10' },
  ];

  return (
    <div className="font-stripe p-4 lg:p-8 space-y-6 max-w-[1200px] mx-auto">
      {/* KPI strip */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-4"
      >
        {metricCards.map((card) => (
          <div
            key={card.id}
            className="bg-[#1c1e54] border border-white/[0.06] rounded-xl p-5 hover:border-white/[0.12] transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-[#8a8f98] uppercase tracking-wider">{card.label}</p>
              <div className={`w-8 h-8 rounded-lg ${card.bg} flex items-center justify-center`}>
                <card.icon className={`w-4 h-4 ${card.color}`} />
              </div>
            </div>
            <p className={`text-2xl font-light tabular-nums ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </motion.div>

      {/* Appointments table */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-[#1c1e54] border border-white/[0.06] rounded-xl overflow-hidden"
      >
        <div className="p-6 border-b border-white/[0.06] flex items-center justify-between">
          <h2 className="text-lg font-light text-white">Agendamentos de Hoje</h2>
          <span className="text-xs text-[#8a8f98] tabular-nums">{todayAppointments.length} total</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.06] text-[#8a8f98]">
                <th className="px-6 py-3 text-left font-medium">Cliente</th>
                <th className="px-6 py-3 text-left font-medium">Serviço</th>
                <th className="px-6 py-3 text-right font-medium">Horário</th>
                <th className="px-6 py-3 text-right font-medium">Valor</th>
                <th className="px-6 py-3 text-right font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {todayAppointments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-10 text-center text-[#8a8f98]">
                    <Calendar className="w-10 h-10 mx-auto mb-3 text-white/10" />
                    <p>Nenhum agendamento para hoje</p>
                  </td>
                </tr>
              ) : (
                todayAppointments.map((apt) => (
                  <tr key={apt.id} className="hover:bg-white/[0.03] transition-colors">
                    <td className="px-6 py-3 font-medium text-white">{apt.clientName}</td>
                    <td className="px-6 py-3 text-[#8a8f98] truncate max-w-[240px]">{apt.serviceNames.join(', ')}</td>
                    <td className="px-6 py-3 text-right text-[#8a8f98] tabular-nums">{formatTime(apt.time)}</td>
                    <td className="px-6 py-3 text-right font-medium text-white tabular-nums">{formatCurrency(apt.totalPrice)}</td>
                    <td className="px-6 py-3 text-right">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-medium ${getStatusBg(apt.status)}`}>
                        {STATUS_LABELS[apt.status]}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Quick actions */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-3"
      >
        <h2 className="text-lg font-light text-white">Ações Rápidas</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Button
            variant="secondary"
            onClick={() => navigate('/admin/servicos')}
            className="justify-start gap-2 rounded-full bg-transparent border-white/10 text-white hover:bg-white/5"
          >
            <Scissors className="w-4 h-4 text-stripe-primary" />
            Adicionar Serviço
          </Button>
          <Button
            variant="secondary"
            onClick={() => navigate('/admin/clientes')}
            className="justify-start gap-2 rounded-full bg-transparent border-white/10 text-white hover:bg-white/5"
          >
            <Users className="w-4 h-4 text-stripe-primary" />
            Cadastrar Cliente
          </Button>
          <Button
            variant="secondary"
            onClick={() => navigate('/admin/agenda')}
            className="justify-start gap-2 rounded-full bg-transparent border-white/10 text-white hover:bg-white/5"
          >
            <Calendar className="w-4 h-4 text-stripe-primary" />
            Nova Agenda
          </Button>
          <Button
            variant="secondary"
            onClick={() => navigate('/admin/financeiro')}
            className="justify-start gap-2 rounded-full bg-transparent border-white/10 text-white hover:bg-white/5"
          >
            <DollarSign className="w-4 h-4 text-stripe-primary" />
            Ver Financeiro
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

function getStatusBg(status: string): string {
  const colors: Record<string, string> = {
    pending: 'bg-amber-500/15 text-amber-300',
    confirmed: 'bg-emerald-500/15 text-emerald-300',
    completed: 'bg-[#533afd]/15 text-[#a5a1ff]',
    cancelled: 'bg-[#ea2261]/15 text-[#ffb3c7]',
  };
  return colors[status] || 'bg-zinc-500/15 text-zinc-300';
}
