import { Link } from 'react-router-dom';
import { MapPin, MessageCircle, ArrowRight, Clock, Sparkles, CheckCircle2, Scissors } from 'lucide-react';
import { Button } from '../components/ui';
import { formatCurrency, formatDuration } from '../lib/utils';
import { MOCK_SERVICES } from '../data/mockData';

export function HomePage() {
  const featuredServices = [
    MOCK_SERVICES.find(s => s.id === 'progressiva-global-longo'),
    MOCK_SERVICES.find(s => s.id === 'escova-longa'),
    MOCK_SERVICES.find(s => s.id === 'nago-solta'),
    MOCK_SERVICES.find(s => s.id === 'nago-masc')
  ].filter((s): s is typeof MOCK_SERVICES[0] => !!s);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-pink-500 selection:text-zinc-950">
      {/* Botão flutuante WhatsApp */}
      <a
        href="https://wa.me/5511947609116?text=Olá%20Naty,%20vim%20pelo%20site%20e%20gostaria%20de%20agendar%20um%20horário."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full shadow-2xl transition-all transform hover:scale-105 border border-emerald-400/30 group"
        aria-label="Falar no WhatsApp"
      >
        <MessageCircle className="w-6 h-6 fill-current text-white animate-bounce" />
        <span className="text-sm font-semibold pr-1 hidden sm:inline">Agendar via WhatsApp</span>
      </a>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-32 lg:pt-36 lg:pb-40 text-center border-b border-zinc-800/80">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-pink-500/10 blur-[130px] rounded-full pointer-events-none animate-pulse-glow" />
        <div className="absolute top-1/3 left-1/4 w-[350px] h-[350px] bg-rose-500/10 blur-[110px] rounded-full pointer-events-none animate-drift-slow" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/90 border border-zinc-800 text-pink-400 text-xs sm:text-sm font-medium tracking-wide shadow-inner backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-pink-400 animate-pulse" />
            <span>Especialista em Tranças & Alisamentos de Alto Padrão ⬢ Diadema - SP</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white font-display leading-[1.1]">
            <span className="animate-gradient-text">A Arte das Tranças</span> & <br />
            <span className="animate-gradient-text">
              A Beleza da sua Identidade
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-zinc-300 max-w-2xl mx-auto leading-relaxed font-light">
            Mais do que um salão, um espaço de pertencimento e autocuidado. Valorizamos sua essência com 18 anos de experiência e atendimento exclusivo.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link to="/servicos" className="w-full sm:w-auto">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto min-w-[240px] bg-zinc-900 hover:bg-zinc-800 text-white border border-rose-500/30 h-14 rounded-2xl transition-all shadow-lg 3d-shadow">
                <Scissors className="w-5 h-5 mr-2 text-rose-400" />
                <span>Ver Tabela de Preços</span>
              </Button>
            </Link>
            <Link to="/agendar" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto min-w-[240px] bg-pink-500 hover:bg-pink-400 text-zinc-950 font-semibold h-14 rounded-2xl shadow-xl shadow-pink-500/25 transition-all transform hover:-translate-y-0.5">
                <span>Agendar Agora</span>
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-12 pt-8 text-sm text-zinc-400 border-t border-zinc-900">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-pink-400 shadow-sm">
                <MapPin className="w-4 h-4" />
              </div>
              <span className="text-zinc-300 font-medium">Av. Paranapanema, 637 - Diadema - SP</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-pink-400 shadow-sm">
                <Clock className="w-4 h-4" />
              </div>
              <span className="text-zinc-300 font-medium">Segunda a Sábado: 9h às 19h</span>
            </div>
          </div>
        </div>
      </section>

      {/* Serviços em Destaque */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-pink-400 mb-2 block">Catálogo de Excelência</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white font-display">Serviços Mais Procurados</h2>
          </div>
          <Link to="/servicos">
            <Button variant="ghost" className="text-pink-400 hover:text-pink-400 hover:bg-pink-500/10">
              Ver catálogo completo com horários
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredServices.map((service) => (
            <div key={service.id} className="group p-6 rounded-3xl bg-zinc-900/80 border border-zinc-800 flex flex-col justify-between hover:border-pink-500/50 transition-all duration-300 hover:-translate-y-1 shadow-lg">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 group-hover:scale-110 transition-transform">
                  <Scissors className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-pink-400 transition-colors">{service.name}</h3>
                  <p className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed">{service.description}</p>
                </div>
                <div className="flex items-center gap-2 text-xs text-zinc-300 font-medium">
                  <Clock className="w-3.5 h-3.5 text-pink-400" />
                  <span>Duração: <strong>{formatDuration(service.duration)}</strong></span>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-zinc-800/80 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase text-zinc-500 block font-medium">Investimento</span>
                  <span className="text-xl font-bold font-display text-pink-400">{formatCurrency(service.price)}</span>
                </div>
                <Link to="/agendar">
                  <Button size="sm" className="bg-zinc-800 hover:bg-pink-500 hover:text-zinc-950 text-white transition-all">
                    Agendar
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quem Sou Eu - Naty Nascimento (18 anos de experiência) */}
      <section className="py-24 bg-gradient-to-b from-zinc-900/60 to-zinc-950 border-t border-zinc-800/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-sm rounded-[2rem] border border-rose-400/30 bg-zinc-900 p-2 shadow-2xl shadow-rose-950/40">
                <div className="absolute -inset-4 -z-10 rounded-[2.5rem] border border-rose-500/10" />
                <div className="absolute -right-12 top-8 h-24 w-24 rounded-full border border-rose-400/30 bg-rose-500/20 blur-xl animate-spin-slow" />
                <div className="absolute -left-12 bottom-16 h-28 w-28 rounded-full border border-pink-300/30 bg-pink-500/20 blur-xl animate-float-slow" />
                <div className="absolute -inset-8 -z-20 rounded-[3rem] bg-pink-500/10 blur-3xl animate-drift-slow" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 h-64 w-64 bg-rose-500/10 blur-[80px] animate-pulse-glow" />
                <div className="relative overflow-hidden rounded-[1.75rem] bg-zinc-800">
                  <img
                    src="/naty.png"
                    alt="Naty Nascimento, especialista em tranças e química capilar"
                    className="block aspect-[4/5] w-full object-cover object-top transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-zinc-950/80 p-5 backdrop-blur-sm">
                    <p className="font-playfair text-2xl text-white">Naty Nascimento</p>
                    <p className="mt-1 text-sm text-rose-300">18 anos de experiência</p>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 p-6 rounded-2xl bg-zinc-900 border border-rose-500/20 shadow-2xl max-w-xs hidden sm:block">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">18 anos de dedicação</div>
                    <div className="text-xs text-zinc-400">Cuidado em cada atendimento</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs font-semibold uppercase tracking-widest text-pink-400 block">Quem Sou Eu</span>
              <p className="text-zinc-300 leading-relaxed font-light">
                Olá! Sou a <strong className="text-white font-semibold">Naty Nascimento</strong>, especialista na <strong className="text-pink-400 font-semibold">arte das tranças</strong> e em <strong className="text-pink-400 font-semibold">química capilar</strong> há <strong className="text-pink-400 font-semibold">18 anos</strong>.
              </p>
              <p className="text-zinc-300 leading-relaxed font-light">
                O Nateliê Hair nasceu do desejo de oferecer um <strong className="font-semibold text-white">atendimento verdadeiramente humanizado</strong>. Entendo que mexer no cabelo muitas vezes envolve superar medos, inseguranças e experiências passadas. Por isso, meu compromisso vai muito além da técnica: aqui você é ouvida com paciência, carinho e respeito, para que a gente reconstrua não só a saúde dos seus fios, mas a sua autoestima.
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-white font-display leading-tight mt-6">
                Cuidar do seu cabelo é restaurar sua autoconfiança e celebrar sua identidade.
              </h2>

              <div className="flex items-center gap-3">
                <a
                  href="https://instagram.com/natelie_hair"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-zinc-900 border border-zinc-800 text-sm font-semibold text-pink-400 hover:bg-pink-500/10 hover:border-pink-500/40 transition-all"
                >
                  <span aria-hidden="true">◎</span>
                  Instagram @natelie_hair
                </a>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <div className="flex items-start gap-3 p-4 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-sm">
                  <Sparkles className="w-5 h-5 text-pink-400 shrink-0 mt-0.5" />
                  <span className="text-sm text-zinc-200">Tranças Nagô, Box Braids e Soltas</span>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-sm">
                  <Sparkles className="w-5 h-5 text-pink-400 shrink-0 mt-0.5" />
                  <span className="text-sm text-zinc-200">Progressivas e Blindagem Capilar</span>
                </div>
              </div>

              <div className="pt-6 border-t border-zinc-800">
                <p className="text-zinc-300 font-light italic mb-4">
                  Agende uma avaliação ou seu horário direto por aqui — cada etapa é pensada no seu tempo e no seu conforto.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link to="/servicos">
                    <Button variant="secondary" className="bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-700">
                      Conhecer serviços
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                  <Link to="/agendar">
                    <Button size="lg" className="bg-pink-500 hover:bg-pink-400 text-zinc-950 font-semibold">
                      Agendar agora
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Estatísticas */}
      <section className="py-20 bg-zinc-950 border-t border-zinc-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-8 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-lg">
              <div className="text-4xl font-bold text-pink-400 font-display">500+</div>
              <div className="text-sm text-zinc-400 mt-2 font-medium">Clientes Atendidas com Excelência</div>
            </div>
            <div className="p-8 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-lg">
              <div className="text-4xl font-bold text-pink-400 font-display">18+</div>
              <div className="text-sm text-zinc-400 mt-2 font-medium">Anos de Experiência: 18 anos</div>
            </div>
            <div className="p-8 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-lg">
              <div className="text-4xl font-bold text-pink-400 font-display">100%</div>
              <div className="text-sm text-zinc-400 mt-2 font-medium">Foco no Cuidado e Bem-estar</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-24 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 to-zinc-900" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(251,191,36,0.08)_0%,_transparent_70%)]" />

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 space-y-6">
          <h2 className="text-3xl sm:text-5xl font-bold text-white font-display">
            Pronta para transformar seu visual?
          </h2>
          <p className="text-zinc-300 max-w-xl mx-auto leading-relaxed">
            Agende seu horário online em segundos ou fale diretamente com a Naty pelo WhatsApp.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link to="/agendar" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto min-w-[220px] bg-pink-500 hover:bg-pink-400 text-zinc-950 font-semibold h-14 rounded-2xl shadow-lg">
                <span>Agendar Agora</span>
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <a
              href="https://wa.me/5511947609116?text=Olá%20Naty,%20vim%20pelo%20site%20e%20gostaria%20de%20agendar%20um%20horário."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto"
            >
              <Button variant="secondary" size="lg" className="w-full sm:w-auto min-w-[220px] bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-700 h-14 rounded-2xl">
                <MessageCircle className="w-5 h-5 mr-2 text-emerald-400" />
                <span>Atendimento via WhatsApp</span>
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}


