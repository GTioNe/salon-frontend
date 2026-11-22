import { motion } from 'framer-motion';
import { useState, useEffect, useMemo } from 'react';
import { DollarSign, TrendingUp, TrendingDown, Plus, Download, Loader2, AlertCircle } from 'lucide-react';
import { Card, Button, Input, Badge } from '../../components/ui';
import { formatCurrency, formatDate } from '../../lib/utils';

const financialsApi = `${(import.meta.env.VITE_API_URL || 'http://localhost:3001').replace(/\/api\/?$/, '')}/api/admin/financials`;
const apiHeaders = { 'ngrok-skip-browser-warning': 'true' };

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  category: string;
  description: string;
  amount: number;
  date: string;
  paymentMethod?: string;
}

export function AdminFinancial() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(financialsApi, { headers: apiHeaders });
        const data = await res.json();
        if (Array.isArray(data)) {
          setTransactions(data);
          setLoadError(null);
        } else {
          setLoadError('Resposta inesperada do servidor.');
        }
      } catch (err) {
        console.error('Erro ao carregar financeiros:', err);
        setLoadError('Não foi possível conectar ao servidor. Verifique se o backend e o ngrok estão ativos.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const [showModal, setShowModal] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [filterMonth, setFilterMonth] = useState(new Date().toISOString().slice(0, 7));

  const [newTransaction, setNewTransaction] = useState<Partial<Transaction>>({
    type: 'income',
    category: '',
    description: '',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    paymentMethod: '',
  });

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const matchType = filterType === 'all' || t.type === filterType;
      const matchMonth = String(t.date).startsWith(filterMonth);
      return matchType && matchMonth;
    });
  }, [transactions, filterType, filterMonth]);

  const totals = useMemo(() => {
    const income = filteredTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
    const expense = filteredTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
    const balance = income - expense;
    return { income, expense, balance };
  }, [filteredTransactions]);

  const handleAddTransaction = async () => {
    if (!newTransaction.category || !newTransaction.description || !newTransaction.amount) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }
    const transaction: Transaction = {
      id: Date.now().toString(),
      type: newTransaction.type as 'income' | 'expense',
      category: newTransaction.category!,
      description: newTransaction.description!,
      amount: Number(newTransaction.amount)!,
      date: newTransaction.date!,
      paymentMethod: newTransaction.paymentMethod,
    };
    try {
      const res = await fetch(financialsApi, {
        method: 'POST',
        headers: { ...apiHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify(transaction),
      });
      if (res.ok) {
        setTransactions([transaction, ...transactions]);
      } else {
        alert('Erro ao salvar transação');
        return;
      }
    } catch (err) {
      console.error('Erro ao salvar:', err);
      alert('Erro ao salvar transação');
      return;
    }
    setShowModal(false);
    setNewTransaction({
      type: 'income',
      category: '',
      description: '',
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      paymentMethod: '',
    });
  };

  const categoryOptions = {
    income: ['Serviço', 'Produto Vendido', 'Gorjeta', 'Outro'],
    expense: ['Produto', 'Aluguel', 'Água/Luz', 'Uber', 'Alimentação', 'Outro'],
  };

  const surface = 'bg-[#1c1e54] border border-white/[0.06]';
  const statCards = [
    { label: 'Entradas', value: totals.income, icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Saídas', value: totals.expense, icon: TrendingDown, color: 'text-stripe-ruby', bg: 'bg-[#ea2261]/10' },
    { label: 'Saldo', value: totals.balance, icon: DollarSign, color: totals.balance >= 0 ? 'text-white' : 'text-stripe-ruby', bg: 'bg-stripe-primary/15' },
  ];

  return (
    <div className="space-y-8 p-4 lg:p-8 max-w-[1200px] mx-auto font-stripe">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-light tracking-tight text-white">Financeiro</h1>
          <p className="text-[#8a8f98] mt-1 text-sm">Controle de entradas e saídas</p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="secondary"
            onClick={() => alert('Em breve: Exportar relatório')}
            className="rounded-full border-stripe-primary/40 text-stripe-primary bg-transparent hover:bg-stripe-primary/10"
          >
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          <Button
            onClick={() => setShowModal(true)}
            className="rounded-full bg-stripe-primary hover:bg-stripe-primary-deep text-white shadow-none"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nova Transação
          </Button>
        </div>
      </motion.div>

      {loadError && (
        <div className="flex items-center gap-3 rounded-lg border border-[#ea2261]/30 bg-[#ea2261]/10 px-4 py-3 text-sm text-[#ffb3c7]">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {loadError}
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        {statCards.map((stat) => (
          <Card key={stat.label} className={`${surface} p-6 rounded-xl`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#8a8f98] text-sm mb-1">{stat.label}</p>
                <p className={`text-2xl font-light tabular-nums ${stat.color}`}>
                  {formatCurrency(stat.value)}
                </p>
              </div>
              <div className={`w-11 h-11 rounded-lg ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </div>
          </Card>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-wrap items-center gap-3"
      >
        <div className="flex gap-2">
          {([
            { key: 'all', label: 'Todas' },
            { key: 'income', label: 'Entradas', icon: TrendingUp },
            { key: 'expense', label: 'Saídas', icon: TrendingDown },
          ] as const).map((f) => (
            <button
              key={f.key}
              onClick={() => setFilterType(f.key)}
              className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                filterType === f.key
                  ? 'bg-stripe-primary text-white'
                  : 'bg-transparent border border-white/10 text-[#8a8f98] hover:text-white hover:border-white/20'
              }`}
            >
              {'icon' in f && f.icon ? <f.icon className="w-3.5 h-3.5" /> : null}
              {f.label}
            </button>
          ))}
        </div>

        <Input
          type="month"
          value={filterMonth}
          onChange={(e) => setFilterMonth(e.target.value)}
          className="w-auto rounded-md"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className={`${surface} p-0 overflow-hidden rounded-xl`}>
          <div className="p-6 border-b border-white/[0.06] flex items-center justify-between">
            <h2 className="text-lg font-light text-white">Transações</h2>
            {loading && <Loader2 className="w-4 h-4 animate-spin text-[#8a8f98]" />}
          </div>

          <div className="divide-y divide-white/[0.04]">
            {loading ? (
              <div className="p-12 text-center text-[#8a8f98]">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3" />
                <p className="text-sm">Carregando transações…</p>
              </div>
            ) : filteredTransactions.length === 0 ? (
              <div className="p-12 text-center">
                <DollarSign className="w-14 h-14 text-white/10 mx-auto mb-4" />
                <p className="text-[#8a8f98]">Nenhuma transação neste período</p>
              </div>
            ) : (
              filteredTransactions.map((t, i) => (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="p-4 hover:bg-white/[0.03] transition-colors flex items-center gap-4"
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                    t.type === 'income' ? 'bg-emerald-500/10' : 'bg-[#ea2261]/10'
                  }`}>
                    {t.type === 'income' ? (
                      <TrendingUp className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-stripe-ruby" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium text-white text-sm truncate">{t.description}</p>
                      <Badge className="capitalize bg-white/[0.06] text-[#8a8f98] text-[10px] rounded-full">
                        {t.category}
                      </Badge>
                      {t.paymentMethod && (
                        <Badge className="bg-stripe-primary/15 text-[#a5a1ff] text-[10px] rounded-full">
                          {t.paymentMethod}
                        </Badge>
                      )}
                    </div>
                    <p className="text-[#8a8f98] text-xs mt-0.5">{formatDate(t.date)}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className={`font-medium text-sm tabular-nums ${
                      t.type === 'income' ? 'text-emerald-400' : 'text-stripe-ruby'
                    }`}>
                      {t.type === 'income' ? '+' : '−'} {formatCurrency(t.amount)}
                    </p>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </Card>
      </motion.div>

      {showModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowModal(false)}
        >
          <motion.div
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-[#1c1e54] border border-white/[0.08] rounded-2xl p-6 max-w-md w-full font-stripe max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-light text-white mb-6">Nova Transação</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-[#8a8f98] mb-2">Tipo</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setNewTransaction({ ...newTransaction, type: 'income' })}
                    className={`p-3 rounded-lg transition-all text-sm font-medium ${
                      newTransaction.type === 'income'
                        ? 'bg-stripe-primary text-white'
                        : 'bg-white/[0.04] border border-white/10 text-[#8a8f98] hover:text-white'
                    }`}
                  >
                    <TrendingUp className="w-4 h-4 mx-auto mb-1" />
                    Entrada
                  </button>
                  <button
                    onClick={() => setNewTransaction({ ...newTransaction, type: 'expense' })}
                    className={`p-3 rounded-lg transition-all text-sm font-medium ${
                      newTransaction.type === 'expense'
                        ? 'bg-[#ea2261] text-white'
                        : 'bg-white/[0.04] border border-white/10 text-[#8a8f98] hover:text-white'
                    }`}
                  >
                    <TrendingDown className="w-4 h-4 mx-auto mb-1" />
                    Saída
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm text-[#8a8f98] mb-2">Categoria</label>
                <select
                  value={newTransaction.category}
                  onChange={(e) => setNewTransaction({ ...newTransaction, category: e.target.value })}
                  className="w-full rounded-md"
                >
                  <option value="">Selecione...</option>
                  {categoryOptions[newTransaction.type as 'income' | 'expense'].map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <Input
                label="Descrição"
                placeholder="Ex: Nagô Feminino - Cliente X"
                value={newTransaction.description}
                onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
              />

              <Input
                label="Valor"
                type="number"
                placeholder="0.00"
                value={newTransaction.amount || ''}
                onChange={(e) => setNewTransaction({ ...newTransaction, amount: parseFloat(e.target.value) })}
              />

              <Input
                label="Data"
                type="date"
                value={newTransaction.date}
                onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
              />

              {newTransaction.type === 'income' && (
                <Input
                  label="Forma de pagamento (opcional)"
                  placeholder="Ex: Pix, Dinheiro, Débito"
                  value={newTransaction.paymentMethod}
                  onChange={(e) => setNewTransaction({ ...newTransaction, paymentMethod: e.target.value })}
                />
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                variant="secondary"
                onClick={() => setShowModal(false)}
                className="flex-1 rounded-full bg-transparent border-white/15 text-white hover:bg-white/5"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleAddTransaction}
                className="flex-1 rounded-full bg-stripe-primary hover:bg-stripe-primary-deep text-white shadow-none"
              >
                Adicionar
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
