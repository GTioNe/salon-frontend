import { motion } from 'framer-motion';
import { DollarSign, Calendar, Clock, Sparkles, Wallet } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { formatCurrency, formatTime } from '../../lib/utils';
import { useSalonStore } from '../../store/salonStore';

/* ── Mock light: usado apenas quando o banco/vitrine está vazio ── */
const EXAMPLE_DATA = {
  revenue: 14500,
  revenueChange: '+8%',
  deposits: 2350,
  depositsPending: 450,
  occupancy: 89,
  occupancyChange: '+5%',
  appointmentsToday: 24,
  appointmentsNew: 14,
  chart: [
    { name: 'seg', revenue: 1500, occupancy: 35 },
    { name: 'ter', revenue: 7350, occupancy: 45 },
    { name: 'qua', revenue: 8000, occupancy: 55 },
    { name: 'qui', revenue: 14500, occupancy: 68 },
    { name: 'sex', revenue: 14500, occupancy: 80 },
    { name: 'sab', revenue: 2350, occupancy: 90 },
    { name: 'dom', revenue: 250, occupancy: 12 },
  ],
  topServices: [
    { name: 'Box Braids', value: 225, pct: 20 },
    { name: 'Twist Braids', value: 123, pct: 15 },
    { name: 'Mega Hair', value: 120, pct: 5 },
    { name: 'Color', value: 68, pct: 8 },
    { name: 'Penteado Especial', value: 18, pct: 10 },
  ],
  todayAppointments: [
    {
      id: '1',
      clientName: 'Ana Paula Lima',
      serviceNames: ['Gana Braids'],
      time: '10:00 - 15:00',
      totalPrice: 550,
      status: 'confirmed' as const,
      payment: 'Sinal Pago (PIX)' as const,
      professional: 'Naty',
    },
    {
      id: '2',
      clientName: 'Maíra Santana',
      serviceNames: ['Penteado Especial (Eventos)'],
      time: '11:30 - 13:00',
      totalPrice: 180,
      status: 'pending' as const,
      payment: 'Aguardando Sinal' as const,
      professional: 'Naty',
    },
    {
      id: '3',
      clientName: 'Camila Camila',
      serviceNames: ['Gana Braids'],
      time: '10:00 - 15:00',
      totalPrice: 550,
      status: 'confirmed' as const,
      payment: 'Sinal Pago (PIX)' as const,
      professional: 'Naty',
    },
    {
      id: '4',
      clientName: 'Jessica Álamo',
      serviceNames: ['Mega Hair'],
      time: '14:30 - 17:00',
      totalPrice: 180,
      status: 'confirmed' as const,
      payment: 'Sinal Pago (PIX)' as const,
      professional: 'Naty',
    },
    {
      id: '5',
      clientName: 'Canauola Lima',
      serviceNames: ['Gana Braids'],
      time: '10:00 - 15:00',
      totalPrice: 550,
      status: 'confirmed' as const,
      payment: 'Sinal Pago (PIX)' as const,
      professional: 'Naty',
    },
    {
      id: '6',
      clientName: 'Maíra Santana',
      serviceNames: ['Penteado Especial (Eventos)'],
      time: '14:30 - 20:00',
      totalPrice: 180,
      status: 'pending' as const,
      payment: 'Aguardando Sinal' as const,
      professional: 'Naty',
    },
  ],
};

export function AdminDashboard() {
  const navigate = useNavigate();
  const { getDashboardMetrics, getAppointmentsByDate, getAppointments, getFinancials, getServices } = useSalonStore();
  useEffect(() => { getAppointments(); getFinancials(); getServices(); }, [getAppointments, getFinancials, getServices]);
  const metrics = getDashboardMetrics();
  const today = new Date().toISOString().split('T')[0];
  const todayAppointments = getAppointmentsByDate(today);

  const hasRealData = todayAppointments.length > 0 || metrics.monthRevenue > 0;
  const data = hasRealData ? null : EXAMPLE_DATA;

  const todays = todayAppointments.map((apt) => ({
    id: apt.id,
    clientName: apt.clientName,
    serviceNames: apt.serviceNames.join(', '),
    time: `${formatTime(apt.time.split(' - ')[0])} - ${formatTime(apt.time.split(' - ')[1] || apt.time.split(' - ')[0])}`,
    totalPrice: apt.totalPrice,
    status: apt.status,
    payment: apt.status === 'confirmed' ? 'Confirmado' : 'Aguardando Sinal',
    professional: apt.professionalName || 'Naty',
  }));

  const nextClient = todays.length > 0 ? todays[0] : null;

  return (
    <div className="font-stripe space-y-6 max-w-[1400px] mx-auto p-4 lg:p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-light tracking-tight text-white">Painel</h1>
          <p className="text-[#8a8f98] mt-1 text-sm">Gestão do salão Nateliê Hair</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-[#1c1e54] border border-white/[0.06] rounded-full px-4 py-2 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-lilac-500 shadow-[0_0_8px_rgba(216,180,254,0.6)]" />
            <span className="text-xs text-[#8a8f98]">Sistema online</span>
          </div>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#1c1e54] border border-white/[0.06] text-white hover:bg-white/[0.04] transition-colors"
          >
            <span className="text-sm">Ver site público</span>
            <Sparkles className="w-3 h-3 text-lilac-500" />
          </button>
        </div>
      </motion.div>

      {/* KPIs */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-4"
      >
        <KpiCard
          label="Faturamento"
          value={data ? formatCurrency(data.revenue) : formatCurrency(metrics.monthRevenue)}
          sub={data ? `Este mês vs. meta: ${data.revenueChange}` : undefined}
          icon={<DollarSign className="w-5 h-5 text-white" />}
          color="text-lilac-500"
          bg="bg-lilac-500/10"
          subColor="text-[#8a8f98]"
        />
        <KpiCard
          label="Sinais (Depósitos)"
          value={data ? formatCurrency(data.deposits) : formatCurrency(metrics.todayRevenue)}
          sub={data ? `A confirmar: R$ ${data.depositsPending.toLocaleString('pt-BR')}` : undefined}
          icon={<Wallet className="w-5 h-5 text-white" />}
          color="text-indigo-400"
          bg="bg-indigo-400/10"
          subColor="text-[#8a8f98]"
        />
        <KpiCard
          label="Ocupação"
          value={`${data ? data.occupancy : metrics.occupancyRate}%`}
          sub={data ? `Variação: ${data.occupancyChange} hoje` : undefined}
          icon={<Clock className="w-5 h-5 text-white" />}
          color="text-white"
          bg="bg-lilac-500/10"
          subColor="text-[#8a8f98]"
        />
        <KpiCard
          label="Agendamentos"
          value={data ? data.appointmentsToday : metrics.todayAppointments}
          sub={data ? `Hoje / ${data.appointmentsNew} novos` : undefined}
          icon={<Calendar className="w-5 h-5 text-white" />}
          color="text-indigo-400"
          bg="bg-indigo-400/10"
          subColor="text-[#8a8f98]"
        />
      </motion.div>

      {/* Gráficos + Próxima cliente */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Gráfico Esquerda */}
        <div className="lg:col-span-2 bg-[#1c1e54] border border-white/[0.06] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-light text-white">Revenue & Service Breakdown</h2>
            <div className="flex gap-2">
              {['Dias', 'Semana', 'Mês'].map((label) => (
                <button
                  key={label}
                  className="px-2 py-1 text-xs rounded bg-white/[0.04] text-[#8a8f98] hover:text-white transition-colors"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-col h-64">
            <ChartRevenue data={data?.chart ?? []} />
          </div>
        </div>

        {/* Gráfico Direita */}
        <div className="bg-[#1c1e54] border border-white/[0.06] rounded-2xl p-6">
          <h2 className="text-lg font-light text-white mb-6">Top Hair Services</h2>
          <ChartServices data={data?.topServices ?? []} />
        </div>

        {/* Próxima Cliente */}
        <div className="bg-[#1c1e54] border border-white/[0.06] rounded-2xl p-6">
          <NextClientCard client={nextClient} />
        </div>
      </motion.div>

      {/* Tabela Agendamentos de Hoje */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-[#1c1e54] border border-white/[0.06] rounded-2xl overflow-hidden"
      >
        <div className="p-6 border-b border-white/[0.06] flex items-center justify-between">
          <h2 className="text-lg font-light text-white">
            Agendamentos de Hoje ({todays.length} total)
          </h2>
          <div className="flex gap-2">
            {['Hoje', 'Semana', 'Mês'].map((label) => (
              <button
                key={label}
                className="px-2 py-1 text-xs rounded bg-white/[0.04] text-[#8a8f98] hover:text-white transition-colors"
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto p-2">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.04] text-[#8a8f98]">
                <th className="px-6 py-3 text-left font-medium">Cliente</th>
                <th className="px-6 py-3 text-left font-medium">Serviço</th>
                <th className="px-6 py-3 text-left font-medium">Horário</th>
                <th className="px-6 py-3 text-right font-medium">Valor (R$)</th>
                <th className="px-6 py-3 text-left font-medium">Status</th>
                <th className="px-6 py-3 text-left font-medium">Profissional</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.02]">
              {todays.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-10 text-center text-[#8a8f98]">
                    <Calendar className="w-10 h-10 mx-auto mb-3 text-white/10" />
                    <p>Nenhum agendamento para hoje</p>
                  </td>
                </tr>
              ) : (
                todays.map((apt) => (
                  <tr key={apt.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-3 font-medium text-white">{apt.clientName}</td>
                    <td className="px-6 py-3 text-[#8a8f98] truncate max-w-[200px]">
                      {apt.serviceNames}
                    </td>
                    <td className="px-6 py-3 text-[#8a8f98] tabular-nums">{apt.time}</td>
                    <td className="px-6 py-3 text-right font-medium text-white tabular-nums">
                      {formatCurrency(apt.totalPrice)}
                    </td>
                    <td className="px-6 py-3 text-left">
                      <PaymentBadge payment={apt.payment} />
                    </td>
                    <td className="px-6 py-3 text-[#8a8f98]">{apt.professional}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {hasRealData === false && (
        <div className="bg-[#1c1e54] border border-white/[0.04] rounded-xl p-4 mt-6">
          <p className="text-xs text-[#8a8f98]">
            Dados de exemplo exibidos porque o banco/vitrine está vazio. Use o toggle de exemplo para visualizar.
          </p>
        </div>
      )}
    </div>
  );
}

function KpiCard({
  label,
  value,
  sub,
  icon,
  color,
  bg,
  subColor,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ReactNode;
  color: string;
  bg: string;
  subColor: string;
}) {
  return (
    <div className={`bg-[#1c1e54] border border-white/[0.06] rounded-xl p-5`}>
      <div className="flex items-center justify-between mb-3">
        <p className={`text-xs ${subColor} uppercase tracking-wider`}>{label}</p>
        <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center`}>
          {icon}
        </div>
      </div>
      <p className={`text-2xl font-light tabular-nums ${color}`}>{value}</p>
      {sub && <p className={`text-xs ${subColor} mt-1`}>{sub}</p>}
    </div>
  );
}

function ChartRevenue({ data }: { data: { name: string; revenue: number }[] }) {
  const maxRev = Math.max(...data.map((d) => d.revenue));

  return (
    <div className="h-full flex items-end gap-2 px-2 pb-4">
      {data.map((d) => {
        const h = Math.round((d.revenue / maxRev) * 100);
        return (
          <div key={d.name} className="flex flex-col items-center gap-1">
            <div
              className={`w-20 rounded-t-lg bg-indigo-400/20 transition-all duration-500 h-[${h}%] flex items-end justify-center`}
              style={{ height: `${h}%` }}
            >
              <span className="text-[10px] text-white/60 mb-1">{d.revenue.toLocaleString('pt-BR')}</span>
            </div>
            <span className="text-[10px] text-[#8a8f98]">{d.name}</span>
          </div>
        );
      })}
    </div>
  );
}

function ChartServices({ data }: { data: { name: string; value: number; pct: number }[] }) {
  return (
    <div className="space-y-3">
      {data.map((svc) => (
        <div key={svc.name} className="flex flex-col gap-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#8a8f98]">{svc.name}</span>
            <span className="text-white">{svc.value}</span>
          </div>
          <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r from-indigo-400 to-lilac-500`}
              style={{ width: `${svc.pct * 2}%` }}
            />
          </div>
          <span className="text-[10px] text-[#8a8f98]">{svc.pct}%</span>
        </div>
      ))}
    </div>
  );
}

function PaymentBadge({ payment }: { payment: string }) {
  const isPaid = payment.includes('Pago');
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
      isPaid
        ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
        : 'bg-[#ea2261]/15 border-[#ea2261]/30 text-[#ffb3c7]'
    }`}>
    {payment}
  </span>
  );
}

function NextClientCard({ client }: { client: any }) {
  return (
    <div className="bg-[#1c1e54]/50 border border-white/[0.04] rounded-xl p-4 flex items-center gap-4">
      <div className="w-12 h-12 rounded-full bg-lilac-500/10 border border-lilac-500/20 flex items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1522336093189-1e853f972a4e?w=200"
          alt="Cliente"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-[#8a8f98] mb-1">Próxima Cliente</p>
        <h3 className="text-base font-light text-white">{client?.clientName || 'Nenhuma cliente'}</h3>
        <p className="text-xs text-[#8a8f98] mt-0.5">
          {client?.serviceNames || ''} • Horário: {client?.time || '-'}
        </p>
      </div>
      <div className="text-right">
        <span className={`block px-2.5 py-1 rounded-full text-xs font-medium border ${
          client?.payment?.includes('Pago')
            ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
            : 'bg-[#ea2261]/15 border-[#ea2261]/30 text-[#ffb3c7]'
        }`}>
          {client?.payment || 'Sem agendamento'}
        </span>
      </div>
    </div>
  );
}
