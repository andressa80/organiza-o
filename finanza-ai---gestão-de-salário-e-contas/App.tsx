
import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { AIForecast } from './components/AIForecast';
import { TransactionCard } from './components/TransactionCard';
import { AddTransactionModal } from './components/AddTransactionModal';
import { Transaction } from './types';
import { MOCK_TRANSACTIONS } from './constants';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [transactions, setTransactions] = useState<Transaction[]>([...MOCK_TRANSACTIONS]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const addTransaction = (newT: Omit<Transaction, 'id'>) => {
    const transactionWithId: Transaction = {
      ...newT,
      id: Math.random().toString(36).substr(2, 9)
    };
    setTransactions(prev => [transactionWithId, ...prev]);
  };

  const filteredTransactions = transactions.filter(t => 
    t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-6xl mx-auto">
          {activeTab === 'dashboard' && (
            <Dashboard 
              transactions={transactions} 
              onAddClick={() => setIsModalOpen(true)} 
            />
          )}

          {activeTab === 'transactions' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-between items-end">
                <div>
                  <h2 className="text-3xl font-bold text-slate-800">Minhas Transações</h2>
                  <p className="text-slate-500">Histórico detalhado de toda sua atividade financeira.</p>
                </div>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-xl flex items-center gap-2 font-semibold shadow-md"
                >
                  Nova Transação
                </button>
              </div>

              <div className="flex gap-4 items-center">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text" 
                    placeholder="Buscar por descrição ou categoria..."
                    className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <button className="p-3 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-slate-800">
                  <SlidersHorizontal size={20} />
                </button>
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 p-2 space-y-1 shadow-sm">
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map(t => (
                    <TransactionCard key={t.id} transaction={t} />
                  ))
                ) : (
                  <div className="py-20 text-center text-slate-400">
                    Nenhuma transação encontrada com esses termos.
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'ai-forecast' && (
            <AIForecast transactions={transactions} />
          )}

          {activeTab === 'investments' && (
            <div className="flex flex-col items-center justify-center h-[70vh] text-center space-y-4">
              <div className="bg-emerald-100 p-6 rounded-full text-emerald-600">
                <Search size={48} />
              </div>
              <h2 className="text-2xl font-bold text-slate-800">Módulo em Desenvolvimento</h2>
              <p className="text-slate-500 max-w-sm">Estamos integrando corretoras para trazer seus investimentos diretamente para o Finanza AI.</p>
            </div>
          )}
        </div>
      </main>

      {isModalOpen && (
        <AddTransactionModal 
          onClose={() => setIsModalOpen(false)} 
          onAdd={addTransaction} 
        />
      )}
    </div>
  );
};

export default App;
