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

  // Cards with click → navegar para a página específica
  const metricCards = [
    { id: 'faturamento-hoje', label: 'Faturamento Hoje', value: formatCurrency(metrics.todayRevenue), icon: DollarSign, color: 'text-rose-400', bg: 'bg-rose-500/10' },
    { id: 'faturamento-mes', label: 'Faturamento Mês', value: formatCurrency(metrics.monthRevenue), icon: TrendingUp, color: 'text-champagne-400', bg: 'bg-champagne-500/10' },
    { id: 'agendamentos-hoje', label: 'Agendamentos Hoje', value: metrics.todayAppointments.toString(), icon: Calendar, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { id: 'novos-clientes', label: 'Novos Clientes', value: metrics.newClientsThisMonth.toString(), icon: Users, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  ];

  return (
    <div className="flex min-h-screen bg-[#17161a] text-zinc-100">
      {/* Header global */}
      <header className="border-b border-white/[0.06] backdrop-blur-sm bg-[rgb(23,22,26)]">
        <div className="max-w-[1400px] mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Scissors className="w-5 h-5 text-amber-400" />
            <h1 className="font-display font-bold text-xl tracking-wider">Nateliê Admin</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/admin/financeiro')}>
              <DollarSign className="w-4 h-4 mr-1" />
              Financeiro
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigate('/admin/agenda')}>
              <Calendar className="w-4 h-4 mr-1" />
              Agenda
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        {/* Metric Strip */}
        <div className="max-w-[1400px] mx-auto px-6 py-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {metricCards.map((card) => (
            <motion.div
              key={card.id}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 120, damping: 15 }}
              className="bg-[rgb(23,22,26)] border border-white/[0.04] rounded-xl p-5 hover:border-white/[0.08] transition-focus focus:outline-none focus:ring-2 focus:ring-champagne-500/20"
            >
              <div className="flex items-between justify-between">
                <p className="text-sm text-zinc-400 uppercase tracking-wider">{card.label}</p>
                <p className={`font-display font-bold text-2xl ${card.color}`}>
                  {card.value}
                </p>
              </div>
              <p className="text-xs text-zinc-400 mt-1 opacity-60">R$ / Qtde / Mês</p>
            </motion.div>
          ))}
        </div>

        {/* Today's Appointments Table */}
        <div className="max-w-[1400px] mx-auto px-6 py-6">
          <h2 className="text-lg font-display font-semibold text-white mb-4 border-b border-white/[0.04] pb-4">
            Próximos Agendamentos Confirmados
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.04] text-zinc-400">
                  <th className="pb-3 font-medium">Cliente</th>
                  <th className="pb-3 font-medium">Serviço</th>
                  <th className="pb-3 font-medium text-right">Data / Horário</th>
                  <th className="pb-3 font-medium text-right">Valor</th>
                  <th className="pb-3 font-medium text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.03]">
                {todayAppointments.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-zinc-500">
                      <Calendar className="w-12 h-12 mx-auto mb-3" />
                      <p>Nenhum agendamento para hoje</p>
                    </td>
                  </tr>
                ) : (
                  todayAppointments.map((apt) => (
                    <tr key={apt.id} className="hover:bg-white/[0.01] transition-colors">
                      <td className="py-3 font-medium text-zinc-300">{apt.clientName}</td>
                      <td className="py-3 text-zinc-300 truncate">{apt.serviceNames.join(', ')}</td>
                      <td className="py-3 text-right text-zinc-400 text-sm">
                        {formatTime(apt.time)}
                      </td>
                      <td className="py-3 text-right font-medium text-champagne-300">
                        {formatCurrency(apt.totalPrice)}
                      </td>
                      <td className="py-3 text-right">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBg(apt.status)}`}>
                          {STATUS_LABELS[apt.status]}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="max-w-[1400px] mx-auto px-6 py-6">
          <h2 className="text-lg font-display font-semibold text-white mb-4 border-b border-white/[0.04] pb-4">
            Ações Rápidas
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Adicionar Serviço */}
            <Button
              variant="secondary"
              onClick={() => {
                navigate('/admin/servicos');
                alert('Funcionalidade: cadastrar novo serviço no catálogo');
              }}
              className="justify-start gap-2 px-4 py-2.5 rounded-xl text-sm font-medium"
            >
              <Scissors className="w-4 h-4" />
              <span>Adicionar Serviço</span>
            </Button>

            {/* Cadastrar Cliente */}
            <Button
              variant="secondary"
              onClick={() => {
                navigate('/admin/clientes');
                alert('Funcionalidade: cadastrar novo cliente');
              }}
              className="justify-start gap-2 px-4 py-2.5 rounded-xl text-sm font-medium"
            >
              <Users className="w-4 h-4" />
              <span>Cadastrar Cliente</span>
            </Button>

            {/* Nova Agenda */}
            <Button
              variant="secondary"
              onClick={() => navigate('/admin/agenda')}
              className="justify-start gap-2 px-4 py-2.5 rounded-xl text-sm font-medium"
            >
              <Calendar className="w-4 h-4" />
              <span>Nova Agenda</span>
            </Button>

            {/* Ver Financeiro */}
            <Button
              variant="secondary"
              onClick={() => navigate('/admin/financeiro')}
              className="justify-start gap-2 px-4 py-2.5 rounded-xl text-sm font-medium"
            >
              <DollarSign className="w-4 h-4" />
              <span>Ver Financeiro</span>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}

function getStatusBg(status: string): string {
  const colors: Record<string, string> = {
    pending: 'bg-amber-500/15',
    confirmed: 'bg-emerald-500/15',
    completed: 'bg-blue-500/15',
    cancelled: 'bg-rose-500/15',
  };
  return colors[status] || 'bg-zinc-500/15';
}