import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Search, X } from 'lucide-react';
import { useState } from 'react';
import { Button, Input, Badge } from '../../components/ui';
import { formatCurrency, formatDuration } from '../../lib/utils';
import { useSalonStore } from '../../store/salonStore';
import { CATEGORIES, type Service } from '../../types';

export function AdminServices() {
  const { services, addService, updateService, deleteService } = useSalonStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [form, setForm] = useState({
    name: '', description: '', price: '', duration: '', category: 'trancas' as Service['category'], popular: false,
  });

  const filteredServices = services.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openNew = () => { setEditing(null); setForm({ name: '', description: '', price: '', duration: '', category: 'trancas', popular: false }); setShowModal(true); };
  const openEdit = (s: Service) => { setEditing(s); setForm({ name: s.name, description: s.description, price: String(s.price), duration: String(s.duration), category: s.category, popular: !!s.popular }); setShowModal(true); };
  const handleSave = () => {
    if (!form.name.trim() || !form.price || !form.duration) return;
    const data = { name: form.name, description: form.description, price: Number(form.price), duration: Number(form.duration), category: form.category, popular: form.popular };
    if (editing) updateService(editing.id, data);
    else addService(data);
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
          <h1 className="font-display font-bold text-3xl gradient-text">Gerenciar Serviços</h1>
          <p className="text-zinc-400 mt-1">{services.length} serviços cadastrados</p>
        </div>
        <Button onClick={openNew}><Plus className="w-4 h-4 mr-2" />Novo Serviço</Button>
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
                <Button variant="ghost" size="sm" onClick={() => openEdit(service)}><Edit className="w-4 h-4" /></Button>
                <Button variant="ghost" size="sm" onClick={() => { if (confirm('Excluir este serviço?')) deleteService(service.id); }}><Trash2 className="w-4 h-4 text-rose-400" /></Button>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-[#1c1e54] border border-white/10 rounded-2xl p-6 max-w-md w-full space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">{editing ? 'Editar Serviço' : 'Novo Serviço'}</h3>
              <button onClick={() => setShowModal(false)} className="text-zinc-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <Input label="Nome" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <Input label="Descrição" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <div className="grid grid-cols-2 gap-3">
              <Input label="Preço (R$)" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
              <Input label="Duração (min)" type="number" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm text-zinc-300 mb-1.5">Categoria</label>
              <select className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-xl px-4 py-3" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as Service['category'] })}>
                {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <label className="flex items-center gap-2 text-sm text-zinc-300">
              <input type="checkbox" checked={form.popular} onChange={(e) => setForm({ ...form, popular: e.target.checked })} />
              Serviço popular
            </label>
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