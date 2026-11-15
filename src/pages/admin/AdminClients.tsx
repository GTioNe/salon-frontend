import { motion } from 'framer-motion';
import { Mail, Phone, Calendar } from 'lucide-react';
import { useState } from 'react';
import { Button, Input, Badge, Avatar } from '../../components/ui';
import { formatCurrency, formatShortDate } from '../../lib/utils';
import { useSalonStore } from '../../store/salonStore';

export function AdminClients() {
  const [searchQuery, setSearchQuery] = useState('');
  const { clients } = useSalonStore();

  const filteredClients = clients.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone.includes(searchQuery) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="font-display font-bold text-3xl gradient-text">Clientes</h1>
          <p className="text-zinc-400 mt-1">{clients.length} clientes cadastrados</p>
        </div>
        <Button><span className="w-4 h-4 mr-2">+</span>Novo Cliente</Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-4"
      >
        <Input
          placeholder="Buscar cliente..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid gap-4"
      >
        {filteredClients.map((client, i) => (
          <motion.div
            key={client.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="glass-card p-6 flex items-center gap-4"
          >
            <Avatar name={client.name} size="lg" />
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h3 className="font-semibold text-zinc-100">{client.name}</h3>
                <Badge variant="premium" size="sm">{client.totalVisits} visitas</Badge>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-zinc-400">
                <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{client.phone}</span>
                <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{client.email}</span>
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />Última: {client.lastVisit ? formatShortDate(client.lastVisit) : 'Nunca'}</span>
              </div>
            </div>
            <div className="text-right">
              <p className="font-display font-bold text-champagne-300">{formatCurrency(client.totalSpent)}</p>
              <p className="text-zinc-500 text-sm">Total gasto</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}