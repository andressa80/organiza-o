
import React, { useState, useEffect } from 'react';
import { getAIFinancialForecast } from '../services/geminiService';
import { Transaction, ForecastResponse } from '../types';
import { BrainCircuit, Sparkles, AlertCircle, TrendingDown, Target, Zap } from 'lucide-react';

interface AIForecastProps {
  transactions: Transaction[];
}

export const AIForecast: React.FC<AIForecastProps> = ({ transactions }) => {
  const [forecast, setForecast] = useState<ForecastResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchForecast = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAIFinancialForecast(transactions);
      if (data) {
        setForecast(data);
      } else {
        setError("Não foi possível gerar a previsão. Tente novamente mais tarde.");
      }
    } catch (err) {
      setError("Erro ao conectar com a IA.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Previsões com IA</h2>
          <p className="text-slate-500">Analise de tendências e sugestões de economia baseadas no seu perfil.</p>
        </div>
        <button 
          onClick={fetchForecast}
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-semibold transition-all shadow-lg active:scale-95"
        >
          {loading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            <BrainCircuit size={20} />
          )}
          {loading ? 'Analisando...' : 'Gerar Nova Previsão'}
        </button>
      </div>

      {!forecast && !loading && !error && (
        <div className="bg-indigo-50 border border-indigo-100 rounded-3xl p-12 text-center flex flex-col items-center gap-4">
          <div className="bg-indigo-100 p-4 rounded-full text-indigo-600 mb-2">
            <Sparkles size={48} />
          </div>
          <h3 className="text-2xl font-bold text-indigo-900">Desbloqueie Insights Profundos</h3>
          <p className="text-indigo-700 max-w-md">
            Clique no botão acima para que nossa IA analise seus últimos gastos e projete o seu futuro financeiro nos próximos 6 meses.
          </p>
        </div>
      )}

      {error && (
        <div className="bg-rose-50 border border-rose-100 p-6 rounded-2xl flex items-center gap-4 text-rose-700">
          <AlertCircle size={24} />
          <p>{error}</p>
        </div>
      )}

      {forecast && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* General Advice Card */}
          <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <Target size={24} />
                <h3 className="text-xl font-bold">Conselho Estratégico</h3>
              </div>
              <p className="text-indigo-50 leading-relaxed text-lg italic">
                "{forecast.generalAdvice}"
              </p>
            </div>
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <BrainCircuit size={150} />
            </div>
          </div>

          {/* Predictions Grid */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 px-1">
              <Zap size={20} className="text-amber-500" />
              Projeções Mensais
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {forecast.forecast.map((item, idx) => (
                <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:border-indigo-200 transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <span className="font-bold text-slate-700">{item.month}</span>
                    <span className={`text-[10px] uppercase font-black px-2 py-1 rounded-full ${
                      item.riskLevel === 'High' ? 'bg-rose-100 text-rose-600' : 
                      item.riskLevel === 'Medium' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'
                    }`}>
                      Risco {item.riskLevel === 'Low' ? 'Baixo' : item.riskLevel === 'Medium' ? 'Médio' : 'Alto'}
                    </span>
                  </div>
                  <div className="text-xl font-black text-slate-900 mb-2">
                    R$ {item.predictedExpense.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                    <span className="text-xs text-slate-400 font-normal ml-1">(estimado)</span>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-2">
                    {item.recommendation}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Educational Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 opacity-80">
        {[
          { icon: <BrainCircuit className="text-blue-500" />, title: "Machine Learning", desc: "Nossos modelos identificam sazonalidade e desvios de padrão em tempo real." },
          { icon: <TrendingDown className="text-emerald-500" />, title: "Otimização", desc: "Identificamos assinaturas esquecidas e gastos supérfluos automaticamente." },
          { icon: <Sparkles className="text-amber-500" />, title: "Precisão", desc: "A cada transação adicionada, a IA se torna mais precisa nas suas previsões." }
        ].map((feat, i) => (
          <div key={i} className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <div className="mb-4">{feat.icon}</div>
            <h4 className="font-bold text-slate-800 mb-1">{feat.title}</h4>
            <p className="text-xs text-slate-500 leading-relaxed">{feat.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
