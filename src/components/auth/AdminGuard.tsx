import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Lock, Scissors, Eye, EyeOff } from 'lucide-react';

const ADMIN_PASSWORD = 'admin'; // ponytail: simple password gate; upgrade to JWT + backend auth when multiple admins are needed

export function AdminGuard() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => localStorage.getItem('natelie_admin_auth') === 'true'
  );
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      localStorage.setItem('natelie_admin_auth', 'true');
      setIsAuthenticated(true);
      setError(false);
      setPassword('');
    } else {
      setError(true);
    }
  };

  return (
    <>
      {/* Admin renders behind the modal so she sees the portal as soon as it opens */}
      <Outlet />

      {!isAuthenticated && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0b0b1a]/80 backdrop-blur-md p-4">
          <div className="w-full max-w-sm bg-[#1c1e54] border border-white/[0.08] rounded-3xl p-7 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-stripe-primary/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />

            <div className="flex flex-col items-center text-center mb-7 relative">
              <div className="w-14 h-14 rounded-2xl bg-stripe-primary flex items-center justify-center shadow-lg shadow-stripe-primary/20 mb-4">
                <Lock className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">Acesso Restrito</h2>
              <p className="text-[#8a8f98] text-sm mt-2">Digite a senha para acessar o painel</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5 relative">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-[#8a8f98] uppercase tracking-widest px-1">Senha de Acesso</label>
                <div className="relative group">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (error) setError(false);
                    }}
                    className={`w-full bg-[#12122b] border ${error ? 'border-[#ea2261]' : 'border-white/[0.06]'} rounded-xl py-3.5 pl-4 pr-12 text-white text-base focus:outline-none focus:ring-2 focus:ring-stripe-primary/40 transition-all placeholder:text-white/10`}
                    placeholder="••••••••"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8a8f98] hover:text-white transition-colors"
                    aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {error && (
                  <p className="text-[#ea2261] text-[10px] font-bold uppercase tracking-wider px-1 mt-1">Senha incorreta</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-stripe-primary hover:bg-stripe-primary-dark text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-stripe-primary/20 active:scale-[0.98]"
              >
                Entrar
              </button>
            </form>

            <div className="mt-7 flex items-center justify-center gap-2 pt-5 border-t border-white/[0.04]">
              <Scissors className="w-4 h-4 text-[#8a8f98]" />
              <span className="text-[10px] font-bold text-[#8a8f98] uppercase tracking-[0.2em]">Nateliê Hair</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
