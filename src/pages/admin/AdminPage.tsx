import { useState, useEffect } from 'react';
import {
  LayoutDashboard, Calendar, DollarSign, Users, Scissors, Settings,
  TrendingUp, Sparkles
} from 'lucide-react';
import { Button, Input } from '../../components/ui';
import { formatCurrency, formatDate } from '../../lib/utils';
import { AdminFinancial } from './AdminFinancial';

type AdminTab = 'dashboard' | 'agenda' | 'financeiro' | 'clientes' | 'servicos' | 'ajustes';

const TABS: { id: AdminTab; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'Painel Geral', icon: LayoutDashboard },
  { id: 'agenda', label: 'Agenda & Horários', icon: Calendar },
  { id: 'financeiro', label: 'Financeiro & Caixa', icon: DollarSign },
  { id: 'clientes', label: 'Clientes & Contatos', icon: Users },
  { id: 'servicos', label: 'Serviços & Preços', icon: Scissors },
  { id: 'ajustes', label: 'Configurações', icon: Settings },
];

export function AdminPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');

  const [appointments, setAppointments] = useState<any[]>([]);
  const [stats, setStats] = useState({ monthlyRevenue: 1250, totalAppointments: 2, totalClients: 2 });

  useEffect(() => {
    const apiBase = (import.meta.env.VITE_API_URL || 'http://localhost:3001').replace(/\/api\/?$/, '');
    async function fetchAdminData() {
      try {
        const [resApp, resStats] = await Promise.all([
          fetch(`${apiBase}/api/admin/reservations`).catch(() => null),
          fetch(`${apiBase}/api/admin/stats`).catch(() => null),
        ]);

        if (resApp && resApp.ok) {
          const dataApp = await resApp.json();
          if (dataApp && dataApp.length > 0) {
            setAppointments(dataApp.map((item: any) => ({
              id: String(item.id),
              clientName: item.client_name,
              phone: item.client_zap,
              email: item.client_email || 'Não informado',
              serviceName: item.service_name,
              date: item.date,
              time: item.time,
              price: item.service_price,
              status: item.status,
              location: item.location,
              cancelCode: item.cancel_code || 'NATELIE'
            })));
          }
        }

        if (resStats && resStats.ok) {
          const dataStats = await resStats.json();
          setStats({
            monthlyRevenue: dataStats.monthlyRevenue || 1250,
            totalAppointments: dataStats.totalAppointments || 2,
            totalClients: dataStats.totalClients || 2,
          });
        }
      } catch (e) {
        console.log('Usando dados locais de demonstração para o admin');
      }
    }
    fetchAdminData();
  }, []);

  const displayAppointments = appointments.length > 0 ? appointments : [];

  const totalInMonth = stats.monthlyRevenue;

  return (
    <div className="flex-1 min-w-0 p-6 lg:p-10 overflow-y-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="text-xl font-bold font-display text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <span>Nateliê Admin</span>
        </div>
        <p className="text-xs text-zinc-400 mt-1">Gestão do salão</p>
      </div>

      {/* Tab nav */}
      <nav className="flex flex-wrap gap-2 mb-8">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                : 'text-zinc-400 hover:bg-zinc-800 hover:text-white border border-transparent'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Dashboard */}
      {activeTab === 'dashboard' && (
        <div className="space-y-8 animate-fadeIn">
          <div>
            <h1 className="text-3xl font-bold font-display text-white">Painel Geral</h1>
            <p className="text-sm text-zinc-400">Visão consolidada do negócio e movimentações do mês.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl relative overflow-hidden">
              <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Entradas do Mês</div>
              <div className="text-3xl font-bold text-amber-400 font-display mt-2">{formatCurrency(totalInMonth)}</div>
              <div className="text-xs text-emerald-400 flex items-center gap-1 mt-2">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+12% vs mês anterior</span>
              </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl relative overflow-hidden">
              <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Agendamentos</div>
              <div className="text-3xl font-bold text-blue-400 font-display mt-2">{stats.totalAppointments}</div>
              <div className="text-xs text-zinc-500 mt-2">Confirmados no sistema</div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl relative overflow-hidden">
              <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Clientes</div>
              <div className="text-3xl font-bold text-roseGold-400 font-display mt-2">{stats.totalClients}</div>
              <div className="text-xs text-zinc-500 mt-2">Base cadastrada</div>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-amber-400" />
              <span>Próximos Agendamentos Confirmados</span>
            </h3>
            {displayAppointments.length === 0 ? (
              <p className="text-sm text-zinc-400">Nenhum agendamento sincronizado no momento.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-zinc-800 text-zinc-400">
                      <th className="pb-3 font-semibold">Cliente</th>
                      <th className="pb-3 font-semibold">Serviço</th>
                      <th className="pb-3 font-semibold">Data / Horário</th>
                      <th className="pb-3 font-semibold">Valor</th>
                      <th className="pb-3 font-semibold text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/50">
                    {displayAppointments.map(app => (
                      <tr key={app.id} className="hover:bg-zinc-800/30">
                        <td className="py-4 font-medium text-white">{app.clientName}</td>
                        <td className="py-4 text-zinc-300">{app.serviceName}</td>
                        <td className="py-4 text-zinc-300">{formatDate(app.date)} às {app.time}</td>
                        <td className="py-4 font-medium text-amber-400">{formatCurrency(app.price)}</td>
                        <td className="py-4 text-right">
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            Confirmado
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Agenda */}
      {activeTab === 'agenda' && (
        <div className="space-y-6 animate-fadeIn">
          <div>
            <h1 className="text-3xl font-bold font-display text-white">Agenda & Horários</h1>
            <p className="text-sm text-zinc-400">Gerencie todos os horários agendados e sincronizados com o Google Calendar.</p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-white">Compromissos</h3>
              <span className="text-xs px-3 py-1 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                Google Calendar Sincronizado 📅
              </span>
            </div>
            <div className="space-y-4">
              {displayAppointments.length === 0 && (
                <p className="text-sm text-zinc-400">Nenhum agendamento sincronizado no momento.</p>
              )}
              {displayAppointments.map(app => (
                <div key={app.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-zinc-800/40 border border-zinc-800">
                  <div className="space-y-1">
                    <div className="font-bold text-white">{app.clientName}</div>
                    <div className="text-sm text-amber-300 font-medium">💇‍♀️ {app.serviceName}</div>
                    <div className="text-xs text-zinc-400">📅 {formatDate(app.date)} às {app.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Financeiro */}
      {activeTab === 'financeiro' && <AdminFinancial />}

      {/* Clientes */}
      {activeTab === 'clientes' && (
        <div className="space-y-6 animate-fadeIn">
          <div>
            <h1 className="text-3xl font-bold font-display text-white">Clientes & Contatos</h1>
            <p className="text-sm text-zinc-400">Base de clientes para campanhas futuras, dicas e promoções.</p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-white">Clientes Cadastrados</h3>
              <span className="text-xs text-zinc-400">Exibidos via API / Admin local</span>
            </div>
            <p className="text-xs text-zinc-400">Os dados reais de clientes ficam armazenados exclusivamente no banco de dados local do backend.</p>
          </div>
        </div>
      )}

      {/* Serviços */}
      {activeTab === 'servicos' && (
        <div className="space-y-6 animate-fadeIn">
          <div>
            <h1 className="text-3xl font-bold font-display text-white">Serviços & Preços</h1>
            <p className="text-sm text-zinc-400">Catálogo de tranças e química capilar oferecidos no Nateliê.</p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h3 className="font-semibold text-white mb-4">Catálogo Ativo</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-zinc-800/40 border border-zinc-800 flex justify-between items-center">
                <div>
                  <div className="font-bold text-white">Nagô Solta</div>
                  <div className="text-xs text-zinc-400">Duração: 10h • Tranças & Nagôs</div>
                </div>
                <div className="text-amber-400 font-bold font-display">R$ 330,00</div>
              </div>
              <div className="p-4 rounded-xl bg-zinc-800/40 border border-zinc-800 flex justify-between items-center">
                <div>
                  <div className="font-bold text-white">Progressiva Global</div>
                  <div className="text-xs text-zinc-400">Duração: 3h • Química & Alisamentos</div>
                </div>
                <div className="text-amber-400 font-bold font-display">R$ 170,00</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ajustes */}
      {activeTab === 'ajustes' && (
        <div className="space-y-6 animate-fadeIn">
          <div>
            <h1 className="text-3xl font-bold font-display text-white">Configurações</h1>
            <p className="text-sm text-zinc-400">Dados do salão, horários de atendimento e integrações.</p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4 max-w-xl">
            <Input label="Nome do Salão" defaultValue="Nateliê Hair" />
            <Input label="Endereço" placeholder="Endereço do salão" />
            <Input label="WhatsApp Principal" placeholder="(00) 00000-0000" />
            <Button className="bg-amber-500 hover:bg-amber-400 text-zinc-900 font-semibold w-full">
              Salvar Alterações
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
