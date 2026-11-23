import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Calendar, DollarSign, Users, Scissors, Settings, 
  LogOut, Menu, Search, HelpCircle, MessageCircle
} from 'lucide-react';
import { useState, useEffect } from 'react';

const getApiBase = () =>
  (import.meta.env.VITE_API_URL || 'http://localhost:3001').replace(/\/api\/?$/, '');

function useBotStatus() {
  const [online, setOnline] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);

    fetch(`${getApiBase()}/api/health`, {
      headers: { 'ngrok-skip-browser-warning': 'true' },
      signal: controller.signal,
    })
      .then((res) => { if (!cancelled) setOnline(res.status < 500); })
      .catch(() => { if (!cancelled) setOnline(false); })
      .finally(() => clearTimeout(timer));

    return () => { cancelled = true; controller.abort(); clearTimeout(timer); };
  }, []);

  return online;
}

const adminNavItems = [
  { path: '/admin', label: 'Painel', icon: LayoutDashboard },
  { path: '/admin/agenda', label: 'Agenda', icon: Calendar },
  { path: '/admin/financeiro', label: 'Financeiro', icon: DollarSign },
  { path: '/admin/clientes', label: 'Clientes', icon: Users },
  { path: '/admin/servicos', label: 'Serviços', icon: Scissors },
  { path: '/admin/ajustes', label: 'Ajustes', icon: Settings },
];

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const botOnline = useBotStatus();

  const navLinkClass = (active: boolean) =>
    `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
      active
        ? 'bg-stripe-primary text-white shadow-lg shadow-stripe-primary/20'
        : 'text-[#8a8f98] hover:bg-white/[0.04] hover:text-white'
    }`;

  return (
    <div className="min-h-screen bg-[#12122b] text-zinc-100 flex font-stripe">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#1c1e54] border-r border-white/[0.06] transform transition-transform duration-300 ease-in-out lg:translate-x-0 flex flex-col
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-stripe-primary flex items-center justify-center shadow-lg shadow-stripe-primary/20">
              <Scissors className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-white text-lg tracking-tight">Nateliê</h2>
              <p className="text-[10px] text-[#8a8f98] uppercase tracking-widest font-bold">Admin Portal</p>
            </div>
          </div>

          <nav className="space-y-1">
            {adminNavItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={navLinkClass(location.pathname === item.path)}
              >
                <item.icon className="w-4 h-4 flex-shrink-0" />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-6 space-y-4">
          <div className="bg-[#1c1e54] border border-white/[0.06] rounded-xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-[#1c1e54] border border-white/[0.06] flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">WhatsApp Bot</p>
                <p className="text-xs text-[#8a8f98]">Status</p>
              </div>
            </div>
            <div className="bg-[#12122b] border border-white/[0.06] rounded-lg px-3 py-2">
              <p className="text-xs text-[#8a8f98]">
                {botOnline === null ? 'Checando...' : botOnline ? 'Operacional' : 'Offline'}
              </p>
            </div>
            <div className="mt-2 bg-[#12122b] border border-white/[0.06] rounded-lg px-3 py-2">
              <p className="text-[11px] text-[#8a8f98]">Agendamento Automático:</p>
              <p className="text-[11px] text-emerald-400 font-semibold mt-0.5">ATIVO</p>
            </div>
          </div>

          <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
            <p className="text-xs text-[#8a8f98] mb-2 font-medium">Suporte Profissional</p>
            <Link to="/ajuda" className="text-xs text-white flex items-center gap-2 hover:underline">
              <HelpCircle className="w-3.5 h-3.5" />
              Central de Ajuda
            </Link>
          </div>
          
          <button
            onClick={() => { localStorage.removeItem('natelie_admin_auth'); navigate('/'); }}
            className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-sm font-medium text-[#8a8f98] hover:bg-rose-500/10 hover:text-rose-400 transition-all border border-transparent hover:border-rose-500/20"
          >
            <LogOut className="w-4 h-4" />
            Sair do Admin
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Header Bar */}
        <header className="h-16 border-b border-white/[0.06] bg-[#1c1e54]/50 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-4 lg:px-8">
          <div className="flex items-center gap-4 flex-1">
            <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg hover:bg-white/5 text-zinc-100 lg:hidden">
              <Menu className="w-6 h-6" />
            </button>
            
            <div className="hidden md:flex items-center gap-3 bg-[#12122b] border border-white/[0.06] rounded-full px-4 py-1.5 w-full max-w-md">
              <Search className="w-4 h-4 text-[#8a8f98]" />
              <input 
                type="text" 
                placeholder="Buscar por agendamentos, clientes ou serviços..." 
                className="bg-transparent border-none text-sm text-white placeholder:text-[#8a8f98] outline-none w-full"
              />
              <span className="text-[10px] text-[#8a8f98] border border-white/10 rounded px-1.5 py-0.5">⌘K</span>
            </div>
          </div>

          <div className="flex items-center gap-3 lg:gap-5">
            <div className="h-8 w-px bg-white/[0.06]" />
            
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-white leading-none">Nati Hair</p>
                <p className="text-[10px] text-[#8a8f98] mt-1 uppercase font-bold">Proprietária</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-stripe-primary flex items-center justify-center text-white font-bold shadow-lg shadow-stripe-primary/20 border-2 border-[#1c1e54]">
                N
              </div>
            </div>
          </div>
        </header>

        {/* Content Space */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 lg:p-8 animate-in fade-in duration-500">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
