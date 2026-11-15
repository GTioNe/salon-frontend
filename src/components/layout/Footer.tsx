import { Link } from 'react-router-dom';
import { MapPin, Clock, Phone, MessageCircle, Scissors } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-pink-50/80 dark:bg-zinc-950 border-t border-pink-100 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400">
      <div className="max-w-6xl mx-auto px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2.5" aria-label="Nateliê Hair - Início">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-400 to-rose-300 flex items-center justify-center text-white shadow-md shadow-pink-500/20">
                <Scissors className="w-5 h-5" />
              </div>
              <span className="font-bold text-xl text-zinc-900 dark:text-white tracking-tight">Nateliê Hair</span>
            </Link>
            <p className="text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
              Tranças e química capilar com atendimento humanizado em Diadema - SP.
            </p>
          </div>

          {/* Contact info */}
          <div className="space-y-3">
            <h3 className="font-semibold text-zinc-900 dark:text-white text-sm uppercase tracking-wider">Contato & Local</h3>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-pink-500 mt-1 flex-shrink-0" />
                <span>Av. Paranapanema, 637 - Diadema - SP</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-pink-500 flex-shrink-0" />
                <a href="tel:+5511947609116" className="hover:text-pink-600 transition-colors">(11) 94760-9116</a>
              </li>
              <li className="flex items-center gap-2.5">
                <MessageCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                <a href="https://wa.me/5511947609116" target="_blank" rel="noopener noreferrer" className="hover:text-pink-600 transition-colors">WhatsApp da Naty</a>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div className="space-y-3">
            <h3 className="font-semibold text-zinc-900 dark:text-white text-sm uppercase tracking-wider">Horário de Atendimento</h3>
            <div className="text-sm space-y-1 text-zinc-500 dark:text-zinc-400">
              <p className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-pink-500 flex-shrink-0" />
                <span>Segunda a Sábado: 09h às 19h</span>
              </p>
              <p className="pl-6">Domingo: 09h às 17h</p>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-pink-200/60 dark:border-zinc-800 flex flex-col gap-5 text-xs text-zinc-400">
          <div className="overflow-hidden rounded-xl border border-pink-500/20 bg-zinc-900/60 py-3">
            <div className="footer-marquee flex w-max gap-16 whitespace-nowrap px-6 text-sm font-medium">
              <span>💕 Feito com carinho para cuidar da sua beleza</span>
              <span>✨ Atendimento humanizado, do jeitinho que você merece</span>
              <span>🌷 Nateliê Hair — beleza, cuidado e acolhimento</span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-center">
            <p>© {currentYear} Nateliê Hair. Todos os direitos reservados.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
