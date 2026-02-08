
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  LayoutDashboard, 
  LogOut, 
  ChevronLeft, 
  ChevronRight,
  Plus,
  Trash2,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Settings
} from 'lucide-react';
import { Transaction, TransactionType, StorageKeys, FinancialInsight } from '../types';
import { DEFAULT_CATEGORIES, APP_NAME, APP_SUBTITLE } from '../constants';
import Analytics from './Analytics';
import Charts from './Charts';
import TransactionForm from './TransactionForm';

interface DashboardProps {
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem(StorageKeys.DATA);
    return saved ? JSON.parse(saved) : [];
  });
  
  const [categories, setCategories] = useState<string[]>(() => {
    const saved = localStorage.getItem(StorageKeys.CATEGORIES);
    return saved ? JSON.parse(saved) : DEFAULT_CATEGORIES;
  });

  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });

  const [showCatManager, setShowCatManager] = useState(false);
  const [newCat, setNewCat] = useState('');

  // Persist data
  useEffect(() => {
    localStorage.setItem(StorageKeys.DATA, JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(StorageKeys.CATEGORIES, JSON.stringify(categories));
  }, [categories]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => t.date.startsWith(currentMonth));
  }, [transactions, currentMonth]);

  const totals = useMemo(() => {
    const income = filteredTransactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
    const expense = filteredTransactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
    return { income, expense, balance: income - expense };
  }, [filteredTransactions]);

  const handleAddTransaction = (newTx: Omit<Transaction, 'id'>) => {
    const tx: Transaction = {
      ...newTx,
      id: crypto.randomUUID(),
    };
    setTransactions(prev => [tx, ...prev]);
  };

  const handleRemoveTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const changeMonth = (offset: number) => {
    const [year, month] = currentMonth.split('-').map(Number);
    const date = new Date(year, month - 1 + offset, 1);
    setCurrentMonth(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`);
  };

  const formatMonthLabel = (monthStr: string) => {
    const [year, month] = monthStr.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }).toUpperCase();
  };

  const handleAddCategory = () => {
    if (newCat && !categories.includes(newCat)) {
      setCategories([...categories, newCat]);
      setNewCat('');
    }
  };

  const removeCategory = (cat: string) => {
    if (categories.length > 1) {
      setCategories(categories.filter(c => c !== cat));
    }
  };

  return (
    <div className="min-h-screen pb-12">
      {/* Header */}
      <nav className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <LayoutDashboard className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-black tracking-tighter text-white">
            {APP_NAME}<span className="text-indigo-500">{APP_SUBTITLE}</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-slate-800 rounded-xl p-1 border border-slate-700">
            <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-4 text-[10px] font-black w-40 text-center tracking-widest text-slate-200">
              {formatMonthLabel(currentMonth)}
            </span>
            <button onClick={() => changeMonth(1)} className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          
          <button 
            onClick={onLogout}
            className="flex items-center gap-2 bg-slate-800 hover:bg-red-500/10 border border-slate-700 hover:border-red-500/50 px-4 py-2 rounded-xl transition-all text-slate-400 hover:text-red-400 font-bold text-xs"
          >
            Sair
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
        {/* Top Summaries */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <SummaryCard title="SALDO ATUAL" value={totals.balance} type="neutral" />
          <SummaryCard title="ENTRADAS" value={totals.income} type="positive" />
          <SummaryCard title="SAÍDAS" value={totals.expense} type="negative" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Controls & History */}
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
               <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-bold flex items-center gap-3">
                  <Plus className="w-6 h-6 text-indigo-500" />
                  Novo Lançamento
                </h2>
                <button 
                  onClick={() => setShowCatManager(!showCatManager)}
                  className="text-xs font-black text-slate-500 hover:text-indigo-400 flex items-center gap-2 transition-colors uppercase tracking-widest"
                >
                  <Settings className="w-4 h-4" /> Categorias
                </button>
              </div>

              {showCatManager && (
                <div className="mb-8 p-6 bg-slate-800/50 rounded-2xl border border-slate-700 animate-in fade-in zoom-in duration-300">
                  <p className="text-[10px] font-black text-slate-500 uppercase mb-4 tracking-widest">Suas Categorias</p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {categories.map(cat => (
                      <span key={cat} className="group flex items-center gap-2 bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-300">
                        {cat}
                        <button onClick={() => removeCategory(cat)} className="text-slate-600 hover:text-red-500 transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input 
                      type="text" value={newCat} onChange={e => setNewCat(e.target.value)}
                      placeholder="Nova categoria..."
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                    />
                    <button onClick={handleAddCategory} className="bg-indigo-600 hover:bg-indigo-700 px-6 py-2 rounded-xl text-sm font-bold shadow-lg shadow-indigo-600/20 transition-all">
                      Adicionar
                    </button>
                  </div>
                </div>
              )}

              <TransactionForm onSubmit={handleAddTransaction} categories={categories} currentMonth={currentMonth} />
            </div>

            <section className="bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden">
              <div className="p-8 border-b border-slate-800 flex justify-between items-center bg-slate-900/50 backdrop-blur-sm">
                <h2 className="text-xl font-bold flex items-center gap-3">
                  <Calendar className="w-6 h-6 text-indigo-500" />
                  Extrato Mensal
                </h2>
                <span className="text-[10px] font-black bg-slate-800 px-3 py-1 rounded-full text-slate-500 border border-slate-700 uppercase tracking-widest">
                  {filteredTransactions.length} Itens
                </span>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-800/50 text-slate-500 text-[10px] uppercase font-black tracking-widest border-b border-slate-800">
                    <tr>
                      <th className="px-8 py-4">Data</th>
                      <th className="px-8 py-4">Descrição</th>
                      <th className="px-8 py-4">Categoria</th>
                      <th className="px-8 py-4">Valor</th>
                      <th className="px-8 py-4 text-right"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {filteredTransactions.map(tx => (
                      <tr key={tx.id} className="hover:bg-slate-800/30 transition-colors group">
                        <td className="px-8 py-4 text-slate-500 font-mono text-xs">{tx.date.split('-').reverse().join('/')}</td>
                        <td className="px-8 py-4 font-bold text-slate-200">{tx.description}</td>
                        <td className="px-8 py-4">
                          <span className="text-[9px] font-black bg-slate-950 border border-slate-800 px-2 py-1 rounded-lg text-slate-400 uppercase tracking-tighter">
                            {tx.category}
                          </span>
                        </td>
                        <td className={`px-8 py-4 font-black text-sm ${tx.type === 'income' ? 'text-emerald-400' : 'text-red-400'}`}>
                          {tx.type === 'income' ? '+' : '-'} R$ {tx.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-8 py-4 text-right">
                          <button 
                            onClick={() => handleRemoveTransaction(tx.id)} 
                            className="p-2 text-slate-700 hover:text-red-500 hover:bg-red-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filteredTransactions.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-24 text-center text-slate-600 font-medium italic">
                          Nenhum registro para este mês.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          {/* Sidebar Analytics */}
          <div className="lg:col-span-4 space-y-8">
            <Analytics transactions={filteredTransactions} currentMonth={currentMonth} totals={totals} />
            <Charts transactions={filteredTransactions} />
          </div>
        </div>
      </main>

      <footer className="text-center py-16 text-[9px] font-black text-slate-700 tracking-[0.4em] uppercase border-t border-slate-900 mt-20">
        Andressa Pro Financial • Pythonic Experience • Powered by Gemini 3.0
      </footer>
    </div>
  );
};

const SummaryCard = ({ title, value, type }: { title: string, value: number, type: 'positive' | 'negative' | 'neutral' }) => {
  const Icon = type === 'positive' ? TrendingUp : type === 'negative' ? TrendingDown : DollarSign;
  const colorClass = type === 'positive' ? 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5' : type === 'negative' ? 'text-red-400 border-red-500/20 bg-red-500/5' : 'text-white border-indigo-500/20 bg-indigo-500/5';

  return (
    <div className={`bg-slate-900 border rounded-3xl p-6 shadow-xl hover:scale-[1.02] transition-transform duration-300`}>
      <div className="flex justify-between items-start mb-4">
        <span className={`p-2 rounded-xl ${colorClass}`}>
          <Icon className="w-5 h-5"/>
        </span>
        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{title}</span>
      </div>
      <h3 className={`text-2xl font-black ${type === 'neutral' && value < 0 ? 'text-red-400' : type === 'neutral' ? 'text-white' : type === 'positive' ? 'text-emerald-400' : 'text-red-400'}`}>
        R$ {Math.abs(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
      </h3>
    </div>
  );
};

export default Dashboard;
