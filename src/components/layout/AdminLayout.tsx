import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Calendar, DollarSign, Users, Scissors, Settings, 
  LogOut, Menu, X
} from 'lucide-react';
import { useState } from 'react';

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

  const navLinkClass = (active: boolean) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
      active
        ? 'bg-stripe-primary/15 text-white border border-stripe-primary/30'
        : 'text-[#8a8f98] hover:bg-white/[0.04] hover:text-white'
    }`;

  return (
    <div className="min-h-screen bg-[#12122b] text-zinc-100 flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#1c1e54] border-r border-white/[0.06] transform transition-transform duration-300 ease-in-out lg:translate-x-0 flex flex-col
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex items-center justify-between p-4 border-b border-white/[0.06] lg:hidden">
          <div className="text-lg font-bold font-display text-white flex items-center gap-2">
            <Scissors className="w-5 h-5 text-stripe-primary" />
            <span>Nateliê Admin</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="p-2 rounded-lg hover:bg-white/5 text-zinc-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {adminNavItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={navLinkClass(location.pathname === item.path)}
            >
              <item.icon className="w-4 h-4 flex-shrink-0 text-stripe-primary" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/[0.06]">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-zinc-400 hover:bg-white/[0.04] hover:text-white transition-all"
          >
            <LogOut className="w-4 h-4" />
            Ver Site Público
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-0 min-w-0">
        {/* Mobile Top Bar */}
        <header className="lg:hidden sticky top-0 z-30 bg-[#1c1e54]/80 backdrop-blur-sm border-b border-white/[0.06]">
          <div className="flex items-center justify-between h-16 px-4">
            <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg hover:bg-white/5 text-zinc-100">
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-bold font-display text-white flex items-center gap-2">
              <Scissors className="w-5 h-5 text-stripe-primary" />
              Admin
            </h1>
            <div className="w-10" />
          </div>
        </header>

        <div className="pt-4 lg:pt-0 pb-16 lg:pb-0">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
