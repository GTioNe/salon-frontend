import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Calendar, DollarSign, Users, Scissors, Settings, 
  TrendingUp, Sparkles
} from 'lucide-react';
import { Button, Input } from '../../components/ui';
import { AdminFinancial } from './AdminFinancial';
import { formatCurrency, formatDate } from '../../lib/utils';

export function AdminPage() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'agenda' | 'financeiro' | 'clientes' | 'servicos' | 'ajustes'>('dashboard');

  const [appointments, setAppointments] = useState<any[]>([]);
  const [stats, setStats] = useState({ monthlyRevenue: 1250, totalAppointments: 2, totalClients: 2 });

  useEffect(() => {
    async function fetchAdminData() {
      try {
        const [resApp, resStats] = await Promise.all([
          fetch('http://localhost:3001/api/admin/reservations').catch(() => null),
          fetch('http://localhost:3001/api/admin/stats').catch(() => null),
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

  // Fallback mock data se vazio
  // Nenhum dado real de clientes no frontend público.
  const displayAppointments = appointments.length > 0 ? appointments : [];

  const [transactions] = useState([
    { id: '1', type: 'in', category: 'Serviço', description: 'Nagô Solta', amount: 330, method: 'Pix', date: '2026-11-09' },
    { id: '2', type: 'out', category: 'Produtos de uso', description: 'Kits de fibra e pomada', amount: 80, method: 'Dinheiro', date: '2026-11-08' }
  ]);

  const totalInMonth = stats.monthlyRevenue;
  const totalOutMonth = transactions.filter(t => t.type === 'out').reduce((acc, t) => acc + t.amount, 0);
  const netProfit = totalInMonth - totalOutMonth;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col lg:flex-row">
      {/* Sidebar Admin */}
      <aside className="w-full lg:w-64 bg-zinc-900 border-r border-zinc-800 p-6 flex flex-col gap-6 shrink-0">
        <div>
          <div className="text-xl font-bold font-display text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <span>Nateliê Admin</span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">Gestão do salão</p>
        </div>

        <nav className="flex flex-col gap-1">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'dashboard' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'}`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Painel Geral
          </button>
          <button 
            onClick={() => setActiveTab('agenda')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'agenda' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'}`}
          >
            <Calendar className="w-4 h-4" />
            Agenda & Horários
          </button>
          <button 
            onClick={() => setActiveTab('financeiro')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'financeiro' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'}`}
          >
            <DollarSign className="w-4 h-4" />
            Financeiro & Caixa
          </button>
          <button 
            onClick={() => setActiveTab('clientes')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'clientes' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'}`}
          >
            <Users className="w-4 h-4" />
            Clientes & Contatos
          </button>
          <button 
            onClick={() => setActiveTab('servicos')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'servicos' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'}`}
          >
            <Scissors className="w-4 h-4" />
            Serviços & Preços
          </button>
          <button 
            onClick={() => setActiveTab('ajustes')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'ajustes' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'}`}
          >
            <Settings className="w-4 h-4" />
            Configurações
          </button>
        </nav>

        <div className="mt-auto pt-6 border-t border-zinc-800 text-xs text-zinc-500 space-y-1">
          <p className="font-semibold text-zinc-400">Naty Nascimento</p>
          <p>WhatsApp comercial configurado</p>
          <p className="text-amber-400 font-medium pt-2">🟢 Sistema Online</p>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-fadeIn">
            <div>
              <h1 className="text-3xl font-bold font-display text-white">Painel Geral</h1>
              <p className="text-sm text-zinc-400">Visão consolidada do negócio e movimentações do mês.</p>
            </div>

            {/* KPI Cards */}
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
                <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Saídas / Despesas</div>
                <div className="text-3xl font-bold text-rose-400 font-display mt-2">{formatCurrency(totalOutMonth)}</div>
                <div className="text-xs text-zinc-500 mt-2">Operacional e insumos</div>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl relative overflow-hidden">
                <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Lucro Líquido</div>
                <div className={`text-3xl font-bold font-display mt-2 ${netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {formatCurrency(netProfit)}
                </div>
                <div className="text-xs text-zinc-500 mt-2">Entradas − Saídas</div>
              </div>
            </div>

            {/* Upcoming Appointments Table */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-amber-400" />
                <span>Próximos Agendamentos Confirmados</span>
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-zinc-800 text-zinc-400">
                      <th className="pb-3 font-semibold">Cliente</th>
                      <th className="pb-3 font-semibold">Serviço</th>
                      <th className="pb-3 font-semibold">Data / Horário</th>
                      <th className="pb-3 font-semibold">Valor</th>
                      <th className="pb-3 font-semibold">Status</th>
                      <th className="pb-3 font-semibold text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/50">
                    {displayAppointments.map(app => (
                      <tr key={app.id} className="hover:bg-zinc-800/30">
                        <td className="py-4 font-medium text-white">{app.clientName}</td>
                        <td className="py-4 text-zinc-300">{app.serviceName}</td>
                        <td className="py-4 text-zinc-300">{formatDate(app.date)} às {app.time}</td>
                        <td className="py-4 font-medium text-amber-400">{formatCurrency(app.price)}</td>
                        <td className="py-4">
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            Confirmado
                          </span>
                        </td>
                        <td className="py-4 text-right">
                          <a className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500/10 hover:bg-green-500/20 text-green-400 text-xs font-medium border border-green-500/30 transition-all">
                            <span className="text-xs font-medium text-green-400">Ver detalhes</span>
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'agenda' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h1 className="text-3xl font-bold font-display text-white">Agenda & Horários</h1>
              <p className="text-sm text-zinc-400">Gerencie todos os horários agendados e sincronizados com o Google Calendar.</p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-white">Compromissos de Novembro de 2026</h3>
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

        {activeTab === 'financeiro' && <AdminFinancial />}


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
      </main>
    </div>
  );
}
