import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Search, Scissors, Sparkles, Crown, MessageCircle, X } from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
import { Card, Badge, Button, Input, Select } from '../components/ui';
import { formatCurrency, formatDuration } from '../lib/utils';
import { useSalonStore } from '../store/salonStore';
import { CATEGORIES, type ServiceCategory } from '../types';

export function ServicesPage() {
  const { services: storeServices, getServices } = useSalonStore();
  useEffect(() => { getServices(); }, [getServices]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | 'all'>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'price-asc' | 'price-desc' | 'name'>('popular');
  const [showPackageDetails, setShowPackageDetails] = useState(false);

  const filteredServices = useMemo(() => {
    let list = [...(storeServices || [])];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      list = list.filter((s: any) => 
        s.name.toLowerCase().includes(query) ||
        s.description.toLowerCase().includes(query) ||
        s.category.toLowerCase().includes(query)
      );
    }

    if (selectedCategory !== 'all') {
      list = list.filter((s: any) => s.category === selectedCategory);
    }

    list.sort((a: any, b: any) => {
      switch (sortBy) {
        case 'popular':
          return (b.popular ? 1 : 0) - (a.popular ? 1 : 0);
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    return list;
  }, [searchQuery, selectedCategory, sortBy, storeServices]);

  const categoriesWithCount = CATEGORIES.map(cat => ({
    ...cat,
    count: (storeServices || []).filter((s: any) => s.category === cat.id).length,
  }));

  return (
    <div className="space-y-12">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-3xl mx-auto"
      >
        <Badge variant="premium" className="mb-4 inline-flex items-center gap-2">
          <Scissors className="w-3 h-3" />
          Catálogo Completo
        </Badge>
        <h1 className="font-display font-bold text-4xl lg:text-5xl gradient-text mb-4">
          Todos os nossos serviços
        </h1>
        <p className="text-zinc-400 text-lg">
          {storeServices?.length || 0} serviços premium em {CATEGORIES.length} categorias.
          Qualidade certificada em cada detalhe.
        </p>
      </motion.header>

      {/* Pacote mensal */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl border border-pink-500/20 bg-pink-500/5 p-6 lg:p-8"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-pink-400 mb-2">Cuidado toda semana</p>
            <h2 className="font-display font-bold text-2xl text-white mb-3">Pacote de Escova</h2>
            <p className="text-zinc-300 leading-relaxed">
              Meus amores, para quem gosta de manter o cabelo cuidado toda semana, o Pacote de Escova reúne quatro escovas no mês com um valor especial.
            </p>
          </div>
          <Button
            onClick={() => setShowPackageDetails(true)}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-pink-500 px-5 py-3 font-semibold text-zinc-950 transition hover:bg-pink-400"
          >
            Conhecer mais o pacote
          </Button>
        </div>
      </motion.section>

      {/* Modal de Detalhes do Pacote */}
      {showPackageDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-[2rem] p-8 shadow-2xl"
          >
            <button
              onClick={() => setShowPackageDetails(false)}
              className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="space-y-6">
              <div>
                <Badge variant="premium" className="mb-3">Cuidado Toda Semana</Badge>
                <h3 className="font-display font-bold text-3xl text-white">Pacote de Escova</h3>
              </div>

              <div className="space-y-4 text-zinc-300 leading-relaxed">
                <p>
                  Meus amores, o Pacote de Escova foi pensado para quem gosta de estar sempre impecável. Ele garante <strong className="text-pink-400 font-semibold">quatro escovas no mês</strong> (uma por semana) com um investimento reduzido.
                </p>
                
                <div className="p-4 rounded-2xl bg-zinc-950/50 border border-zinc-800 space-y-3">
                  <p className="text-sm font-medium text-zinc-100 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-pink-400" />
                    Como funciona:
                  </p>
                  <ul className="text-sm space-y-2 list-disc list-inside text-zinc-400">
                    <li>O valor depende do comprimento e do volume do cabelo.</li>
                    <li>O pacote é individual e válido por 30 dias.</li>
                    <li>Com aviso prévio, a sessão pode ser remarcada dentro do período.</li>
                    <li>Falta sem aviso ou cancelamento em cima da hora consome a escova da semana.</li>
                  </ul>
                </div>

                <p className="text-sm italic">
                  "Agende uma avaliação ou seu horário direto por aqui — cada etapa é pensada no seu tempo e no seu conforto."
                </p>
              </div>

              <div className="flex flex-col gap-3 pt-2">
                <a
                  href="https://wa.me/5511947609116?text=Olá%20Naty!%20Gostaria%20de%20tirar%20dúvidas%20sobre%20o%20Pacote%20de%20Escova."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-4 font-bold text-white transition hover:bg-emerald-500"
                >
                  <MessageCircle className="w-5 h-5" />
                  Falar com a Naty no WhatsApp
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Filters */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-6"
      >
        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
            <Input
              placeholder="Buscar serviço..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as ServiceCategory | 'all')}
              options={[
                { value: 'all', label: 'Todas as categorias' },
                ...CATEGORIES.map((c) => ({ value: c.id, label: `${c.name} (${categoriesWithCount.find((cc) => cc.id === c.id)?.count || 0})` }))
              ]}
              className="w-full lg:w-48"
            />

            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              options={[
                { value: 'popular', label: 'Mais populares' },
                { value: 'name', label: 'A-Z' },
                { value: 'price-asc', label: 'Preço: Menor → Maior' },
                { value: 'price-desc', label: 'Preço: Maior → Menor' },
              ]}
              className="w-full lg:w-56"
            />
          </div>

          <div className="text-zinc-400 text-sm self-center">
            {filteredServices.length} de {(storeServices?.length || 0)} serviços
          </div>
        </div>
      </motion.section>

      {/* Services Grid */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {selectedCategory !== 'all' && (
          <div className="mb-6 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-champagne-500/20 to-roseGold-500/20 flex items-center justify-center">
              <span className="text-2xl">{CATEGORIES.find((c) => c.id === selectedCategory)?.icon}</span>
            </div>
            <div>
              <h2 className="font-display font-bold text-2xl gradient-text">
                {CATEGORIES.find((c) => c.id === selectedCategory)?.name}
              </h2>
              <p className="text-zinc-400">
                {categoriesWithCount.find((c) => c.id === selectedCategory)?.count} serviços disponíveis
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredServices.map((service, i) => {
            const category = CATEGORIES.find((c) => c.id === service.category);
            return (
              <motion.article
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="glass-card-hover h-full flex flex-col overflow-hidden" padding="none">
                  <div className="aspect-video relative bg-gradient-to-br from-champagne-500/10 to-roseGold-500/10 overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Scissors className="w-16 h-16 text-champagne-500/20" />
                    </div>
                    <div className="absolute top-3 left-3 right-3 flex justify-between">
                      {service.popular && (
                        <Badge variant="premium" size="sm">
                          <Crown className="w-3 h-3 mr-1" /> Popular
                        </Badge>
                      )}
                      {category && (
                        <Badge variant="premium" size="sm" className="ml-auto">
                          {category.name}
                        </Badge>
                      )}
                    </div>
                    <div className="absolute bottom-3 left-3 right-3 flex justify-between">
                      <div className="flex gap-2">
                        {category && (
                          <span className="px-2 py-1 bg-luxury-950/80 backdrop-blur rounded-full text-xs text-zinc-300">
                            {category.name}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold text-zinc-100 pr-2">{service.name}</h3>
                      <span className="font-display font-bold text-champagne-300 whitespace-nowrap">
                        {formatCurrency(service.price)}
                      </span>
                    </div>

                    <p className="text-zinc-400 text-sm mb-4 flex-1 line-clamp-2">{service.description}</p>

                    <div className="flex flex-wrap gap-3 text-sm text-zinc-500 mb-4 pt-3 border-t border-white/5">
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4" />
                        {formatDuration(service.duration)}
                      </span>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Link
                        to="/agendar"
                        className="inline-flex w-full items-center justify-center rounded-xl bg-pink-500 px-3 py-2 text-xs font-semibold text-zinc-950 transition hover:bg-pink-400"
                      >
                        Agendar este serviço
                      </Link>
                      <a
                        href={`https://wa.me/5511947609116?text=${encodeURIComponent(`Olá, Naty! Vi o site do Nateliê Hair e gostaria de tirar uma dúvida sobre ${service.name.toLowerCase()} para entender o que combina com o meu cabelo.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-500/30 px-3 py-2 text-xs font-semibold text-emerald-400 transition hover:bg-emerald-500/10"
                      >
                        <MessageCircle className="w-4 h-4" />
                        Tirar dúvida comigo
                      </a>
                    </div>
                  </div>
                </Card>
              </motion.article>
            );
          })}
        </div>

        {filteredServices.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-12 text-center"
          >
            <Search className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
            <h3 className="font-display font-semibold text-xl text-zinc-100 mb-2">
              Nenhum serviço encontrado
            </h3>
            <p className="text-zinc-400 mb-6">
              Tente ajustar os filtros ou busque por outro termo
            </p>
            <Button variant="secondary" onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}>
              Limpar filtros
            </Button>
          </motion.div>
        )}
      </motion.section>

      {/* Categories Overview */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
        className="pt-8"
      >
        <h2 className="font-display font-bold text-2xl lg:text-3xl gradient-text text-center mb-8">
          Explorar por categoria
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {CATEGORIES.map((cat, i) => (
            <motion.button
              key={cat.id}
              onClick={() => setSelectedCategory(selectedCategory === cat.id ? 'all' : cat.id)}
              className={`relative aspect-square rounded-2xl overflow-hidden glass-card-hover flex flex-col items-center justify-center p-6 text-center transition-all duration-300 ${
                selectedCategory === cat.id 
                  ? 'ring-2 ring-champagne-500/50 bg-champagne-500/10' 
                  : ''
              }`}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              {cat.icon.startsWith('/') ? <img src={cat.icon} alt="" className="h-16 w-16 rounded-xl object-contain mb-3" /> : <div className="text-4xl mb-3">{cat.icon}</div>}
              <h3 className="font-semibold text-zinc-100 mb-1">{cat.name}</h3>
              <p className="text-zinc-400 text-sm">
                {categoriesWithCount.find(c => c.id === cat.id)?.count || 0} serviços
              </p>
              {selectedCategory === cat.id && (
                <div className="absolute inset-0 bg-gradient-to-t from-champagne-500/20 to-transparent" />
              )}
            </motion.button>
          ))}
        </div>
      </motion.section>
    </div>
  );
}