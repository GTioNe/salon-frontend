import { motion } from 'framer-motion';
import { useState, useMemo } from 'react';
import { DollarSign, TrendingUp, TrendingDown, Plus, Download } from 'lucide-react';
import { Card, Button, Input, Badge } from '../../components/ui';
import { formatCurrency, formatDate } from '../../lib/utils';

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
  const [transactions, setTransactions] = useState<Transaction[]>([
    // Exemplo de transações
    { id: '1', type: 'income', category: 'Serviço', description: 'Nagô Feminino', amount: 180, date: '2026-11-08', paymentMethod: 'Pix' },
    { id: '2', type: 'expense', category: 'Produto', description: 'Shampoo profissional', amount: 45, date: '2026-11-07' },
    { id: '3', type: 'income', category: 'Serviço', description: 'Escova Longa', amount: 60, date: '2026-11-07', paymentMethod: 'Dinheiro' },
    { id: '4', type: 'expense', category: 'Aluguel', description: 'Aluguel do espaço', amount: 500, date: '2026-11-05' },
  ]);
  
  const [showModal, setShowModal] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [filterMonth, setFilterMonth] = useState(new Date().toISOString().slice(0, 7)); // yyyy-mm
  
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
      const matchMonth = t.date.startsWith(filterMonth);
      return matchType && matchMonth;
    });
  }, [transactions, filterType, filterMonth]);

  const totals = useMemo(() => {
    const income = filteredTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expense = filteredTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const balance = income - expense;
    return { income, expense, balance };
  }, [filteredTransactions]);

  const handleAddTransaction = () => {
    if (!newTransaction.category || !newTransaction.description || !newTransaction.amount) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }
    const transaction: Transaction = {
      id: Date.now().toString(),
      type: newTransaction.type as 'income' | 'expense',
      category: newTransaction.category!,
      description: newTransaction.description!,
      amount: newTransaction.amount!,
      date: newTransaction.date!,
      paymentMethod: newTransaction.paymentMethod,
    };
    setTransactions([transaction, ...transactions]);
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="font-display font-bold text-3xl gradient-text">Financeiro</h1>
          <p className="text-zinc-400 mt-1">Controle de entradas e saídas</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => alert('Em breve: Exportar relatório')}>
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          <Button onClick={() => setShowModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Nova Transação
          </Button>
        </div>
      </motion.div>

      {/* Metrics Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-6"
      >
        <Card className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-zinc-400 text-sm mb-1">Entradas</p>
              <p className="font-display font-bold text-2xl text-emerald-400">{formatCurrency(totals.income)}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-emerald-400" />
            </div>
          </div>
        </Card>

        <Card className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-zinc-400 text-sm mb-1">Saídas</p>
              <p className="font-display font-bold text-2xl text-rose-400">{formatCurrency(totals.expense)}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-rose-400" />
            </div>
          </div>
        </Card>

        <Card className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-zinc-400 text-sm mb-1">Saldo</p>
              <p className={`font-display font-bold text-2xl ${totals.balance >= 0 ? 'text-champagne-400' : 'text-rose-400'}`}>
                {formatCurrency(totals.balance)}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-champagne-500/10 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-champagne-400" />
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-wrap gap-4"
      >
        <div className="flex gap-2">
          <Button
            variant={filterType === 'all' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setFilterType('all')}
          >
            Todas
          </Button>
          <Button
            variant={filterType === 'income' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setFilterType('income')}
          >
            <TrendingUp className="w-4 h-4 mr-1" />
            Entradas
          </Button>
          <Button
            variant={filterType === 'expense' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setFilterType('expense')}
          >
            <TrendingDown className="w-4 h-4 mr-1" />
            Saídas
          </Button>
        </div>

        <Input
          type="month"
          value={filterMonth}
          onChange={(e) => setFilterMonth(e.target.value)}
          className="w-auto"
        />
      </motion.div>

      {/* Transactions List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="glass-card p-0 overflow-hidden">
          <div className="p-6 border-b border-white/10">
            <h2 className="font-display font-semibold text-xl gradient-text">Transações</h2>
          </div>

          <div className="divide-y divide-white/5">
            {filteredTransactions.length === 0 ? (
              <div className="p-12 text-center">
                <DollarSign className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
                <p className="text-zinc-400">Nenhuma transação neste período</p>
              </div>
            ) : (
              filteredTransactions.map((t, i) => (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="p-4 hover:bg-white/5 transition-colors flex items-center gap-4"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    t.type === 'income' ? 'bg-emerald-500/20' : 'bg-rose-500/20'
                  }`}>
                    {t.type === 'income' ? (
                      <TrendingUp className="w-6 h-6 text-emerald-400" />
                    ) : (
                      <TrendingDown className="w-6 h-6 text-rose-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <p className="font-medium text-zinc-100">{t.description}</p>
                      <Badge className="capitalize bg-white/5 text-zinc-400 text-xs">
                        {t.category}
                      </Badge>
                      {t.paymentMethod && (
                        <Badge className="bg-champagne-500/20 text-champagne-400 text-xs">
                          {t.paymentMethod}
                        </Badge>
                      )}
                    </div>
                    <p className="text-zinc-400 text-sm">{formatDate(t.date)}</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold text-lg ${
                      t.type === 'income' ? 'text-emerald-400' : 'text-rose-400'
                    }`}>
                      {t.type === 'income' ? '+' : '-'} {formatCurrency(t.amount)}
                    </p>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </Card>
      </motion.div>

      {/* Modal */}
      {showModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-card p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-display font-bold text-2xl gradient-text mb-6">Nova Transação</h3>

            <div className="space-y-4">
              <div>
                <label className="label-field">Tipo</label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <button
                    onClick={() => setNewTransaction({ ...newTransaction, type: 'income' })}
                    className={`p-3 rounded-xl transition-all ${
                      newTransaction.type === 'income'
                        ? 'bg-emerald-500 text-white'
                        : 'bg-white/5 border border-white/10'
                    }`}
                  >
                    <TrendingUp className="w-5 h-5 mx-auto mb-1" />
                    <div className="text-sm font-medium">Entrada</div>
                  </button>
                  <button
                    onClick={() => setNewTransaction({ ...newTransaction, type: 'expense' })}
                    className={`p-3 rounded-xl transition-all ${
                      newTransaction.type === 'expense'
                        ? 'bg-rose-500 text-white'
                        : 'bg-white/5 border border-white/10'
                    }`}
                  >
                    <TrendingDown className="w-5 h-5 mx-auto mb-1" />
                    <div className="text-sm font-medium">Saída</div>
                  </button>
                </div>
              </div>

              <div>
                <label className="label-field">Categoria</label>
                <select
                  value={newTransaction.category}
                  onChange={(e) => setNewTransaction({ ...newTransaction, category: e.target.value })}
                  className="input-field"
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
              <Button variant="secondary" onClick={() => setShowModal(false)} className="flex-1">
                Cancelar
              </Button>
              <Button onClick={handleAddTransaction} className="flex-1">
                Adicionar
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}