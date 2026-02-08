
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis } from 'recharts';
import { Transaction } from '../types';

interface ChartsProps {
  transactions: Transaction[];
}

const Charts: React.FC<ChartsProps> = ({ transactions }) => {
  const expenseData = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc: any[], t) => {
      const existing = acc.find(x => x.name === t.category);
      if (existing) {
        existing.value += t.amount;
      } else {
        acc.push({ name: t.category, value: t.amount });
      }
      return acc;
    }, []);

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

  return (
    <div className="space-y-8">
      <section className="bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl p-8">
        <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6">Divisão por Categoria</h3>
        <div className="h-[250px] w-full">
          {expenseData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expenseData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {expenseData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', fontSize: '10px', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-700 text-xs font-bold uppercase italic">
              Sem dados de despesa
            </div>
          )}
        </div>
        <div className="grid grid-cols-2 gap-2 mt-4">
           {expenseData.slice(0, 4).map((entry, index) => (
             <div key={entry.name} className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
               <span className="text-[10px] text-slate-500 font-bold truncate max-w-[80px]">{entry.name}</span>
             </div>
           ))}
        </div>
      </section>

      <section className="bg-gradient-to-br from-indigo-900/10 to-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl relative overflow-hidden group">
        <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
           <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
           Status de Orçamento
        </h3>
        
        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <span className="text-xs font-bold text-slate-500">Fluxo de Caixa</span>
            <span className="text-lg font-black text-white">Mensal</span>
          </div>
          
          <div className="h-[100px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { name: 'Entr.', val: transactions.filter(t => t.type === 'income').reduce((a, b) => a + b.amount, 0) },
                { name: 'Saíd.', val: transactions.filter(t => t.type === 'expense').reduce((a, b) => a + b.amount, 0) }
              ]}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#64748b', fontWeight: 'bold' }} />
                <Tooltip 
                   cursor={{ fill: 'transparent' }}
                   contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                />
                <Bar dataKey="val" radius={[4, 4, 0, 0]}>
                  <Cell fill="#10b981" />
                  <Cell fill="#ef4444" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Charts;
