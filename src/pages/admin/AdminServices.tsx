import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { useState } from 'react';
import { Button, Input, Badge } from '../../components/ui';
import { formatCurrency, formatDuration } from '../../lib/utils';
import { useSalonStore } from '../../store/salonStore';
import { CATEGORIES } from '../../types';

export function AdminServices() {
  const [searchQuery, setSearchQuery] = useState('');
  const { services } = useSalonStore();

  const filteredServices = services.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="font-display font-bold text-3xl gradient-text">Gerenciar Serviços</h1>
          <p className="text-zinc-400 mt-1">{services.length} serviços cadastrados</p>
        </div>
        <Button><Plus className="w-4 h-4 mr-2" />Novo Serviço</Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-4"
      >
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
          <Input
            placeholder="Buscar serviço..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12"
          />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid gap-4"
      >
        {filteredServices.map((service, i) => {
          const category = CATEGORIES.find(c => c.id === service.category);
          return (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="glass-card p-6 flex items-center justify-between"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-zinc-100">{service.name}</h3>
                  {service.popular && <Badge variant="premium" size="sm">Popular</Badge>}
                  {category && <Badge size="sm">{category.name}</Badge>}
                </div>
                <p className="text-zinc-400 text-sm mb-3">{service.description}</p>
                <div className="flex flex-wrap gap-4 text-sm text-zinc-500">
                  <span className="font-semibold text-champagne-300">{formatCurrency(service.price)}</span>
                  <span>{formatDuration(service.duration)}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm"><Edit className="w-4 h-4" /></Button>
                <Button variant="ghost" size="sm"><Trash2 className="w-4 h-4 text-rose-400" /></Button>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}