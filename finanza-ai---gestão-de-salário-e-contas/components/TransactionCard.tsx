
import React from 'react';
import { Transaction } from '../types';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Home, 
  Zap, 
  Wifi, 
  ShoppingBag, 
  Car, 
  Heart, 
  Coffee, 
  HelpCircle,
  Banknote
} from 'lucide-react';

const categoryIcons: Record<string, React.ReactNode> = {
  'Salário': <Banknote size={18} />,
  'Aluguel/Condomínio': <Home size={18} />,
  'Água/Luz/Gás': <Zap size={18} />,
  'Internet/TV': <Wifi size={18} />,
  'Mercado': <ShoppingBag size={18} />,
  'Transporte': <Car size={18} />,
  'Saúde': <Heart size={18} />,
  'Lazer': <Coffee size={18} />,
  'Outros': <HelpCircle size={18} />,
};

export const TransactionCard: React.FC<{ transaction: Transaction }> = ({ transaction }) => {
  const isIncome = transaction.type === 'income';
  
  return (
    <div className="bg-white p-4 rounded-xl border border-slate-100 hover:shadow-md transition-shadow flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-full ${isIncome ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
          {isIncome ? <ArrowUpRight size={20} /> : <ArrowDownLeft size={20} />}
        </div>
        <div>
          <h3 className="font-semibold text-slate-800">{transaction.description}</h3>
          <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
            <span className="flex items-center gap-1">
              {categoryIcons[transaction.category] || categoryIcons['Outros']}
              {transaction.category}
            </span>
            <span>•</span>
            <span>{new Date(transaction.date).toLocaleDateString('pt-BR')}</span>
          </div>
        </div>
      </div>
      <div className={`text-lg font-bold ${isIncome ? 'text-emerald-600' : 'text-slate-800'}`}>
        {isIncome ? '+' : '-'} R$ {transaction.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
      </div>
    </div>
  );
};
