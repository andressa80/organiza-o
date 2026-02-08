
import React, { useState } from 'react';
import { TransactionType, Transaction } from '../types';

interface TransactionFormProps {
  onSubmit: (tx: Omit<Transaction, 'id'>) => void;
  categories: string[];
  currentMonth: string;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ onSubmit, categories, currentMonth }) => {
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType>('expense');
  const [category, setCategory] = useState(categories[0] || 'Outros');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount.replace(',', '.'));
    if (!desc || isNaN(val) || val <= 0) return;

    const today = new Date();
    const [y, m] = currentMonth.split('-').map(Number);
    const isTodayInSelectedMonth = today.getFullYear() === y && (today.getMonth() + 1) === m;
    const dateStr = isTodayInSelectedMonth 
      ? today.toISOString().split('T')[0] 
      : `${currentMonth}-01`;

    onSubmit({
      description: desc,
      amount: val,
      type,
      category,
      date: dateStr,
    });

    setDesc('');
    setAmount('');
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
      <div className="md:col-span-1">
        <label className="text-[10px] text-slate-500 font-black uppercase block mb-2 tracking-widest">Descrição</label>
        <input 
          value={desc} 
          onChange={e => setDesc(e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all" 
          placeholder="Ex: Aluguel"
        />
      </div>
      <div>
        <label className="text-[10px] text-slate-500 font-black uppercase block mb-2 tracking-widest">Valor (R$)</label>
        <input 
          type="text"
          value={amount} 
          onChange={e => setAmount(e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-mono" 
          placeholder="0.00"
        />
      </div>
      <div>
        <label className="text-[10px] text-slate-500 font-black uppercase block mb-2 tracking-widest">Categoria e Fluxo</label>
        <div className="flex gap-2">
          <select 
            value={type} 
            onChange={e => setType(e.target.value as TransactionType)}
            className="bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer appearance-none"
          >
            <option value="expense">Saída</option>
            <option value="income">Entrada</option>
          </select>
          <select 
            value={category} 
            onChange={e => setCategory(e.target.value)}
            className="flex-1 bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer appearance-none"
          >
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>
      <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-black h-[48px] rounded-xl transition-all shadow-xl shadow-indigo-600/30 active:scale-[0.98]">
        Lançar Dados
      </button>
    </form>
  );
};

export default TransactionForm;
