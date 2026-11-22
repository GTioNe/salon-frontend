import { motion } from 'framer-motion';
import { useState, useEffect, useMemo } from 'react';
import {
  DollarSign, TrendingUp, TrendingDown, Plus, Download, Loader2, AlertCircle, MessageCircle
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Card, Button, Input, Badge, Modal } from '../../components/ui';
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
  status?: 'pending' | 'confirmed';
}

export function AdminFinancial() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense' | 'signals'>('all');
  const [filterMonth, setFilterMonth] = useState(new Date().toISOString().slice(0, 7));

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
      const typeMatch = filterType === 'all'
        ? true
        : filterType === 'income'
          ? t.type === 'income'
          : filterType === 'expense'
            ? t.type === 'expense'
            : filterType === 'signals'
              ? t.type === 'income' && (t.paymentMethod?.includes('PIX') || t.paymentMethod?.includes('Sinal'))
              : false;
      
      const monthMatch = String(t.date).startsWith(filterMonth);
      return typeMatch && monthMatch;
    });
  }, [transactions, filterType, filterMonth]);

  // KPI Totals
  const totals = useMemo(() => {
    const income = filteredTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
    const expense = filteredTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
    const balance = income - expense;

    const sinais = filteredTransactions.filter(
      t => t.type === 'income' && (t.paymentMethod?.includes('PIX') || t.paymentMethod?.includes('Sinal'))
    ).reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

    return { income, expense, balance, sinais };
  }, [filteredTransactions]);

  // Chart data: Line chart needs points for each day in the month
  const lineChartData = useMemo(() => {
    const entries = filteredTransactions.filter(t => t.type === 'income').reduce((acc, t) => {
      const day = t.date.split('-')[2];
      acc[day] = (acc[day] || 0) + (Number(t.amount) || 0);
      return acc;
    }, {} as Record<string, number>);

    const expenses = filteredTransactions.filter(t => t.type === 'expense').reduce((acc, t) => {
      const day = t.date.split('-')[2];
      acc[day] = (acc[day] || 0) + (Number(t.amount) || 0);
      return acc;
    }, {} as Record<string, number>);

    const data = [];
    for (let i = 1; i <= 30; i++) {
      const day = String(i).padStart(2, '0');
      data.push({
        name: day,
        income: entries[day] || 0,
        outcome: expenses[day] || 0,
      });
    }
    return data;
  }, [filteredTransactions]);

  // Donut chart data
  const donutChartData = useMemo(() => {
    const expenses = filteredTransactions.filter(t => t.type === 'expense');
    const byCategory = expenses.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + (Number(t.amount) || 0);
      return acc;
    }, {} as Record<string, number>);
    return Object.entries(byCategory).map(([category, total]) => ({
      name: category,
      value: total,
    }));
  }, [filteredTransactions]);

  const handleExport = () => {
    const rows = [
      ['Data', 'Tipo', 'Categoria', 'Descrição', 'Valor', 'Pagamento', 'Status'],
      ...filteredTransactions.map((t) => [
        t.date,
        t.type === 'income' ? 'Entrada' : 'Saída',
        t.category,
        t.description,
        Number(t.amount).toFixed(2).replace('.', ','),
        t.paymentMethod || '',
        t.status || 'Pendente',
      ]),
    ];
    const csv = rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(';')).join('\\n');
    const blob = new Blob(['\\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `financeiro-${filterMonth}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleAddTransaction = async () => {
    if (!newTransaction.category || !newTransaction.description || !newTransaction.amount) {
      setFormError('Preencha categoria, descrição e valor.');
      return;
    }
    setFormError(null);
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
        setShowModal(false);
        setNewTransaction({
          type: 'income',
          category: '',
          description: '',
          amount: 0,
          date: new Date().toISOString().split('T')[0],
          paymentMethod: '',
        });
      } else {
        setFormError('Erro ao salvar transação.');
        return;
      }
    } catch (err) {
      console.error('Erro ao salvar:', err);
      setFormError('Erro ao salvar transação.');
      return;
    }
  };

  const categoryOptions = {
    income: ['Serviço', 'Produto Vendido', 'Gorjeta', 'Outro'],
    expense: ['Produto', 'Aluguel', 'Água/Luz', 'Uber', 'Alimentação', 'Outro'],
  };

  const surface = 'bg-[#1c1e54] border border-white/[0.06]';

  return (
    <div className="space-y-8 p-4 lg:p-8 max-w-[1400px] mx-auto font-stripe">
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
            onClick={handleExport}
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

      {/* KPI Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6"
      >
        {/* Entradas Card */}
        <Card className={`${surface} p-6 rounded-xl`}>
          <div className="flex items-between justify-between">
            <div>
              <p className="text-[#8a8f98] text-sm mb-1">Entradas</p>
              <p className="text-2xl font-light tabular-nums text-emerald-400">{formatCurrency(totals.income)}</p>
            </div>
            <div className="w-11 h-11 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
        </Card>

        {/* Saídas Card */}
        <Card className={`${surface} p-6 rounded-xl`}>
          <div className="flex items-between justify-between">
            <div>
              <p className="text-[#8a8f98] text-sm mb-1">Saídas</p>
              <p className="text-2xl font-light tabular-nums text-stripe-ruby">{formatCurrency(totals.expense)}</p>
            </div>
            <div className="w-11 h-11 rounded-lg bg-[#ea2261]/10 flex items-center justify-center">
              <TrendingDown className="w-5 h-5 text-stripe-ruby" />
            </div>
          </div>
        </Card>

        {/* Saldo Card */}
        <Card className={`${surface} p-6 rounded-xl`}>
          <div className="flex items-between justify-between">
            <div>
              <p className="text-[#8a8f98] text-sm mb-1">Saldo</p>
              <p className={`text-2xl font-light tabular-nums ${totals.balance >= 0 ? 'text-white' : 'text-stripe-ruby'}`}>
                {formatCurrency(totals.balance)}
              </p>
            </div>
            <div className="w-11 h-11 rounded-lg bg-stripe-primary/15 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
          </div>
        </Card>

        {/* Sinais de Agendamento Card */}
        <Card className={`${surface} p-6 rounded-xl`}>
          <div className="flex items-between justify-between">
            <div>
              <p className="text-[#8a8f98] text-sm mb-1">Sinais de Agendamento</p>
              <p className="text-2xl font-light tabular-nums text-indigo-400">{formatCurrency(totals.sinais)}</p>
            </div>
            <div className="w-11 h-11 rounded-lg bg-indigo-500/10 flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-indigo-400" />
            </div>
          </div>
          <p className="text-xs text-[#8a8f98] mt-2">Total recebido via PIX confirmado + valor pendente</p>
        </Card>
      </motion.div>

      {/* Filter Pills + Date Selector */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-[#1c1e54] border border-white/[0.06] rounded-2xl p-4 flex flex-col lg:flex-row items-center justify-between gap-4"
      >
        <div className="flex gap-2">
          {([
            { key: 'all', label: 'Todas' },
            { key: 'income', label: 'Entradas', icon: TrendingUp },
            { key: 'expense', label: 'Saídas', icon: TrendingDown },
            { key: 'signals', label: 'Sinais', icon: MessageCircle },
          ] as const).map((f) => (
            <button
              key={f.key}
              onClick={() => setFilterType(f.key)}
              className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                filterType === f.key
                  ? 'bg-lilac-500 text-[#12122b] font-semibold shadow-sm'
                  : 'bg-transparent border border-white/10 text-[#8a8f98] hover:text-white hover:border-white/20'
              }`}
            >
              {'icon' in f && f.icon ? <f.icon className="w-3.5 h-3.5" /> : null}
              {f.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Input
            type="month"
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
            className="w-auto rounded-md"
          />
        </div>
      </motion.div>

      {/* Charts Section: Line Chart + Donut Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6"
      >
        {/* Fluxo de Caixa Line Chart */}
        <div className="bg-[#1c1e54] border border-white/[0.06] rounded-2xl p-6">
          <h2 className="text-lg font-light text-white mb-4">Fluxo de Caixa Semanal</h2>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={lineChartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <XAxis dataKey="name" stroke="#8a8f98" tick={{ fontSize: 10, fill: '#8a8f98' }} />
              <YAxis stroke="#8a8f98" tick={{ fontSize: 10, fill: '#8a8f98' }} />
              <Tooltip />
              <Legend verticalAlign="bottom" height={36} />
              <Area dataKey="income" name="Entradas" fill="url(#incomeGradient)" stroke="#8b5cf6" strokeWidth={2} />
              <Area dataKey="outcome" name="Saídas" fill="url(#outcomeGradient)" stroke="#f472b6" strokeWidth={2} />
              <defs>
                <linearGradient id="incomeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#d8b4fe" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="outcomeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#f87171" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#f472b6" stopOpacity={0.1} />
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Despesas por Categoria Donut Chart */}
        <div className="bg-[#1c1e54] border border-white/[0.06] rounded-2xl p-6">
          <h2 className="text-lg font-light text-white mb-4">Receitas por Categoria</h2>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={donutChartData.length > 0 ? donutChartData : [{ name: 'Sem Dados', value: 1 }]} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={90}>
                {donutChartData.map((d, i) => (
                  <Cell key={d.name} fill={['#d8b4fe', '#818cf8', '#f472b6', '#34d399', '#fbbf24'][i % 5]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Transactions Table */}
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
                  {/* Avatar + Cliente/Descrição */}
                  <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                    <span className="text-xs font-medium text-white">
                      {t.description.length > 0 ? t.description[0].toUpperCase() : '?' }
                    </span>
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

                  {/* Tipo ícone + Valor */}
                  <div className="text-right shrink-0">
                    <span className={`text-sm font-medium ${t.type === 'income' ? 'text-emerald-400' : 'text-stripe-ruby'}`}>
                      {t.type === 'income' ? '+' : '−'} {formatCurrency(t.amount)}
                    </span>
                  </div>

                  {/* Status badge */}
                  <div className="ml-3 flex shrink-0">
                    <Badge
                      className={`capitalize px-2.5 py-1 rounded-full text-xs font-medium border ${
                        t.status === 'confirmed'
                          ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                          : 'bg-amber-500/15 border-amber-500/30 text-amber-400'
                      }`}
                    >
                      {t.status || 'Pago'}
                    </Badge>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </Card>
      </motion.div>

      {/* Modal Nova Transação */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Nova Transação"
        size="md"
      >
        <div className="space-y-4">
          {formError && <p role="alert" className="text-sm text-[#ffb3c7]">{formError}</p>}
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
              className="w-full bg-[#12122b] border border-white/[0.06] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-lilac-500"
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
        </div>
      </Modal>
    </div>
  );
}