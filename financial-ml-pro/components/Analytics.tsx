
import React, { useState } from 'react';
import { BrainCircuit, Loader2, Sparkles, TrendingUp, CheckCircle2, AlertCircle } from 'lucide-react';
import { Transaction, FinancialInsight } from '../types';
import { getFinancialInsights } from '../services/geminiService';

interface AnalyticsProps {
  transactions: Transaction[];
  currentMonth: string;
  totals: { balance: number, income: number, expense: number };
}

const Analytics: React.FC<AnalyticsProps> = ({ transactions, currentMonth, totals }) => {
  const [insight, setInsight] = useState<FinancialInsight | null>(null);
  const [loading, setLoading] = useState(false);

  const runAnalysis = async () => {
    if (transactions.length === 0) return;
    setLoading(true);
    const result = await getFinancialInsights(transactions, currentMonth);
    setInsight(result);
    setLoading(false);
  };

  const statusColor = insight?.status === 'good' ? 'text-emerald-400 border-emerald-500' : insight?.status === 'warning' ? 'text-yellow-400 border-yellow-500' : 'text-red-400 border-red-500';

  return (
    <section className="bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl p-8 relative overflow-hidden group">
      <div className="absolute -right-10 -top-10 opacity-5 group-hover:opacity-10 transition-opacity">
        <BrainCircuit className="w-56 h-56" />
      </div>

      <div className="flex items-center gap-4 mb-8">
        <div className="bg-indigo-600 p-3 rounded-2xl shadow-xl shadow-indigo-600/20">
          <BrainCircuit className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="font-black text-xl text-white tracking-tight">Análise IA</h2>
          <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Gemini Predictive Core</p>
        </div>
      </div>

      <button 
        onClick={runAnalysis}
        disabled={loading || transactions.length === 0}
        className="w-full bg-slate-950 hover:bg-indigo-600/20 border border-slate-800 hover:border-indigo-500/50 text-white font-black py-4 rounded-2xl transition-all shadow-xl disabled:opacity-30 flex justify-center items-center gap-3 active:scale-95 mb-8"
      >
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
        {loading ? "PROCESSANDO..." : "OBTER INSIGHTS"}
      </button>

      {insight ? (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className={`p-4 rounded-2xl border-l-4 bg-slate-950/50 ${statusColor}`}>
            <div className="flex items-center gap-2 mb-2">
              {insight.status === 'good' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              <h4 className="text-[10px] font-black uppercase tracking-widest">Diagnóstico</h4>
            </div>
            <p className="text-xs leading-relaxed text-slate-400 italic">"{insight.summary}"</p>
          </div>

          <div className="space-y-3">
            <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Plano de Ação</h4>
            {insight.tips.map((tip, i) => (
              <div key={i} className="flex gap-3 p-3 bg-slate-800/40 rounded-xl border border-slate-700/50">
                <div className="w-5 h-5 bg-indigo-500/20 rounded-lg flex items-center justify-center text-indigo-400 text-[9px] font-black flex-shrink-0">{i+1}</div>
                <span className="text-xs text-slate-400 font-medium leading-relaxed">{tip}</span>
              </div>
            ))}
          </div>

          <div className="pt-6 border-t border-slate-800/50">
            <h4 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-2 flex items-center gap-2">
              <TrendingUp className="w-3 h-3" /> Predição de Tendência
            </h4>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-[11px] text-slate-500 font-medium leading-relaxed">
              {insight.prediction}
            </div>
          </div>
        </div>
      ) : (
        <div className="py-12 text-center space-y-4">
          <div className="bg-slate-950 w-16 h-16 rounded-full mx-auto flex items-center justify-center text-slate-800 border border-slate-800">
            <Sparkles className="w-8 h-8" />
          </div>
          <p className="text-[11px] text-slate-500 font-bold max-w-[200px] mx-auto uppercase tracking-tighter">
            {transactions.length === 0 ? "Adicione transações para habilitar a IA" : "Analise seus gastos mensais com inteligência preditiva"}
          </p>
        </div>
      )}
    </section>
  );
};

export default Analytics;
