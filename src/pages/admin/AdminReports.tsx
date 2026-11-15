import { motion } from 'framer-motion';
import { Download, TrendingUp, DollarSign, Users, Calendar } from 'lucide-react';
import { Card, Button } from '../../components/ui';
import { formatCurrency } from '../../lib/utils';
import { useSalonStore } from '../../store/salonStore';

export function AdminReports() {
  const { getDashboardMetrics } = useSalonStore();
  const metrics = getDashboardMetrics();

  const reportCards = [
    { label: 'Faturamento Total', value: formatCurrency(metrics.monthRevenue), icon: DollarSign, color: 'text-emerald-400' },
    { label: 'Ticket Médio', value: formatCurrency(metrics.monthRevenue / Math.max(metrics.monthAppointments, 1)), icon: TrendingUp, color: 'text-champagne-400' },
    { label: 'Agendamentos', value: metrics.monthAppointments.toString(), icon: Calendar, color: 'text-blue-400' },
    { label: 'Clientes Ativos', value: metrics.totalClients.toString(), icon: Users, color: 'text-roseGold-400' },
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="font-display font-bold text-3xl gradient-text">Relatórios</h1>
          <p className="text-zinc-400 mt-1">Análise de performance do salão</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary"><Download className="w-4 h-4 mr-2" />Exportar PDF</Button>
          <Button variant="secondary"><Download className="w-4 h-4 mr-2" />Exportar CSV</Button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {reportCards.map((metric, i) => (
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
              <div className={`w-12 h-12 rounded-xl ${metric.color}/10 flex items-center justify-center`}>
                <metric.icon className={`w-6 h-6 ${metric.color}`} />
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid lg:grid-cols-2 gap-6"
      >
        <Card className="glass-card p-6">
          <h3 className="font-display font-semibold text-xl gradient-text mb-4">Visão Geral</h3>
          <div className="space-y-4">
            <StatRow label="Ocupação média" value={`${Math.round(metrics.occupancyRate)}%`} />
            <StatRow label="Novos clientes este mês" value={metrics.newClientsThisMonth.toString()} />
            <StatRow label="Agendamentos confirmados" value={Math.round(metrics.monthAppointments * 0.7).toString()} />
            <StatRow label="Taxa de cancelamento" value="8%" />
          </div>
        </Card>

        <Card className="glass-card p-6">
          <h3 className="font-display font-semibold text-xl gradient-text mb-4">Top Serviços</h3>
          <div className="space-y-3">
            {[
              { name: 'Corte Feminino', revenue: 12450 },
              { name: 'Hidratação Profunda', revenue: 9800 },
              { name: 'Mechas / Balayage', revenue: 8750 },
              { name: 'Manicure em Gel', revenue: 7200 },
              { name: 'Escova Modelada', revenue: 6100 },
            ].map((svc, i) => (
              <motion.div
                key={svc.name}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center justify-between p-3 bg-white/5 rounded-xl"
              >
                <span className="font-medium text-zinc-100">{svc.name}</span>
                <span className="text-champagne-300 font-semibold">{formatCurrency(svc.revenue)}</span>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
      <span className="text-zinc-300">{label}</span>
      <span className="font-bold text-champagne-300">{value}</span>
    </div>
  );
}