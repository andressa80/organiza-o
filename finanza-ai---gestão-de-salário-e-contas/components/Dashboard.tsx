
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { Transaction, MonthlyData } from '../types';
import { TransactionCard } from './TransactionCard';
import { Wallet, TrendingUp, TrendingDown, Plus, CreditCard } from 'lucide-react';

interface DashboardProps {
  transactions: Transaction[];
  onAddClick: () => void;
}

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#6366f1'];

export const Dashboard: React.FC<DashboardProps> = ({ transactions, onAddClick }) => {
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
  const balance = totalIncome - totalExpense;

  // Salary commitment calculation
  const salaryUsagePercent = totalIncome > 0 ? (totalExpense / totalIncome) * 100 : 0;

  const categoryData = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc: any[], t) => {
      const existing = acc.find(i => i.name === t.category);
      if (existing) {
        existing.value += t.amount;
      } else {
        acc.push({ name: t.category, value: t.amount });
      }
      return acc;
    }, [])
    .sort((a, b) => b.value - a.value);

  const historyData: MonthlyData[] = [
    { month: 'Jan', spent: 3100, income: 4500 },
    { month: 'Fev', spent: 2900, income: 4500 },
    { month: 'Mar', spent: 3400, income: 4700 },
    { month: 'Abr', spent: 3200, income: 4500 },
    { month: 'Mai', spent: totalExpense, income: totalIncome },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Organização Mensal</h2>
          <p className="text-slate-500">Acompanhe seu salário e o pagamento das suas contas.</p>
        </div>
        <button 
          onClick={onAddClick}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-xl flex items-center gap-2 font-semibold transition-all shadow-md active:scale-95"
        >
          <Plus size={20} />
          Registrar Gasto
        </button>
      </div>

      {/* Main Salary Bar Card */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
        <div className="flex justify-between items-end mb-6">
          <div>
            <span className="text-sm font-medium text-slate-400 block mb-1">Status do Salário</span>
            <div className="text-4xl font-black text-slate-900">R$ {balance.toLocaleString('pt-BR')} <span className="text-lg font-medium text-slate-400">sobrando</span></div>
          </div>
          <div className="text-right">
            <span className="text-sm font-bold text-slate-600 block">{salaryUsagePercent.toFixed(1)}% Comprometido</span>
            <span className="text-xs text-slate-400">do total de R$ {totalIncome.toLocaleString('pt-BR')}</span>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden flex">
          <div 
            className={`h-full transition-all duration-1000 ease-out ${salaryUsagePercent > 90 ? 'bg-rose-500' : salaryUsagePercent > 70 ? 'bg-amber-500' : 'bg-emerald-500'}`}
            style={{ width: `${Math.min(salaryUsagePercent, 100)}%` }}
          ></div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
           <div className="p-4 bg-slate-50 rounded-2xl">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Entradas</span>
              <div className="text-lg font-bold text-emerald-600">R$ {totalIncome.toLocaleString('pt-BR')}</div>
           </div>
           <div className="p-4 bg-slate-50 rounded-2xl">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Gastos Fixos</span>
              <div className="text-lg font-bold text-slate-800">R$ {totalExpense.toLocaleString('pt-BR')}</div>
           </div>
           <div className="p-4 bg-slate-50 rounded-2xl">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Disponível</span>
              <div className="text-lg font-bold text-blue-600">R$ {balance.toLocaleString('pt-BR')}</div>
           </div>
           <div className="p-4 bg-slate-50 rounded-2xl">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Economia</span>
              <div className="text-lg font-bold text-indigo-600">{Math.max(0, 100 - salaryUsagePercent).toFixed(0)}%</div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Historical Evolution */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800">Evolução Mensal</h3>
            <div className="flex items-center gap-4 text-xs font-medium">
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Ganhos</div>
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-rose-500"></div> Gastos</div>
            </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={historyData}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} 
                />
                <Area type="monotone" dataKey="income" stroke="#10b981" fillOpacity={1} fill="url(#colorIncome)" strokeWidth={3} />
                <Area type="monotone" dataKey="spent" stroke="#f43f5e" fillOpacity={0} strokeWidth={3} strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expenses by Priority/Category */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Divisão de Contas</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData.slice(0, 5)} layout="vertical" margin={{ left: 10 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={80} style={{ fontSize: '10px', fontWeight: 'bold' }} />
                <Tooltip />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                   {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-3">
            {categoryData.slice(0, 3).map((item, idx) => (
              <div key={item.name} className="flex flex-col gap-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">{item.name}</span>
                  <span className="font-bold text-slate-800">R$ {item.value.toLocaleString('pt-BR')}</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                   <div className="h-full bg-indigo-500" style={{ width: `${(item.value / totalExpense) * 100}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* List section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-slate-800">Pagamentos do Mês</h3>
          <button className="text-emerald-600 text-sm font-semibold hover:underline">Histórico Completo</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {transactions.slice(0, 6).map(t => (
            <TransactionCard key={t.id} transaction={t} />
          ))}
        </div>
      </div>
    </div>
  );
};
