import { motion } from 'framer-motion';
import { Mail, Phone, Calendar, Plus, Edit, Trash2, Search, X } from 'lucide-react';
import { useState } from 'react';
import { Button, Input, Badge, Avatar } from '../../components/ui';
import { formatCurrency, formatShortDate } from '../../lib/utils';
import { useSalonStore } from '../../store/salonStore';

export function AdminClients() {
  const { clients, addClient, updateClient, deleteClient } = useSalonStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState({
    name: '', phone: '', email: '', notes: '',
  });

  const filteredClients = clients.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone.includes(searchQuery) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openNew = () => { setEditing(null); setForm({ name: '', phone: '', email: '', notes: '' }); setShowModal(true); };
  const openEdit = (c: any) => { setEditing(c); setForm({ name: c.name, phone: c.phone, email: c.email, notes: c.notes || '' }); setShowModal(true); };
  const handleSave = () => {
    if (!form.name.trim() || !form.phone) return;
    const data = { name: form.name, phone: form.phone, email: form.email || '', notes: form.notes };
    if (editing) updateClient(editing.id, data);
    else addClient(data);
    setShowModal(false);
  };

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
        <Button onClick={openNew}><Plus className="w-4 h-4 mr-2" />Novo Cliente</Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative"
      >
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
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
            <div className="mt-auto flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => openEdit(client)}><Edit className="w-4 h-4" /></Button>
              <Button variant="ghost" size="sm" onClick={() => { if (confirm('Excluir este cliente?')) deleteClient(client.id); }}><Trash2 className="w-4 h-4 text-rose-400" /></Button>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-[#1c1e54] border border-white/10 rounded-2xl p-6 max-w-md w-full space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">{editing ? 'Editar Cliente' : 'Novo Cliente'}</h3>
              <button onClick={() => setShowModal(false)} className="text-zinc-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <Input label="Nome" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <Input label="Telefone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <Input label="E-mail" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <Input label="Observações" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            <div className="flex gap-3 pt-2">
              <Button variant="secondary" className="flex-1" onClick={() => setShowModal(false)}>Cancelar</Button>
              <Button className="flex-1" onClick={handleSave}>Salvar</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}