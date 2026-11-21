import { Link } from 'react-router-dom';
import { Scissors, Calendar } from 'lucide-react';
import { Button } from '../ui';

export function Header() {
  return (
    <header className="sticky top-0 z-40 bg-zinc-950/95 backdrop-blur-md border-b border-rose-500/10">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group" aria-label="Nateliê Hair - Início">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-rose-500/30 group-hover:scale-105 transition-transform">
            <Scissors className="w-7 h-7" />
          </div>
          <div>
            <span className="font-serif font-bold text-xl text-white tracking-tight block">Nateliê Hair</span>
            <span className="text-xs text-rose-400 font-medium block">Tranças & Química Capilar ñ é para remover</span>
          </div>
        </Link>

        {/* Action Button */}
        <Link to="/agendar">
          <Button className="bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg shadow-rose-500/30 transition-all hover:-translate-y-0.5 hover:from-rose-400 hover:to-pink-400">
            <Calendar className="mr-2 h-4 w-4" />
            Agendar Agora
          </Button>
        </Link>
      </div>
    </header>
  );
}
